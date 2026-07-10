import { Prisma, prisma } from "@cerios/database";
import type {
    BadgeDto,
    GamificationAwardResultDto,
    GamificationSummaryDto,
    MilestoneReachedDto,
    PointsActivityType,
    PointsAwardDto,
    PointsHistoryEntryDto,
} from "@cerios/shared-types";
import {
    getLevelForPoints,
    getQuizPointsForScore,
    LEVELS,
    POINTS_MILESTONES,
    PointsRule,
    QUIZ_RESULT_RULE_CODE,
    STREAK_REWARDS,
} from "@cerios/shared-types";
import { Injectable, NotFoundException } from "@nestjs/common";

function isUniqueConstraintError(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

function toUtcMidnight(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/** ISO 8601 week key, e.g. "2026-W28", so weeks are compared per-calendar-week, not per-day. */
function getIsoWeekKey(date: Date): string {
    const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const isoWeekday = target.getUTCDay() === 0 ? 7 : target.getUTCDay();
    target.setUTCDate(target.getUTCDate() + 4 - isoWeekday);
    const isoYear = target.getUTCFullYear();
    const yearStart = new Date(Date.UTC(isoYear, 0, 1));
    const weekNumber = Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return `${isoYear}-W${String(weekNumber).padStart(2, "0")}`;
}

function previousWeekAnchor(date: Date): Date {
    const previous = new Date(date.getTime());
    previous.setUTCDate(previous.getUTCDate() - 7);
    return previous;
}

function disabledResult(totalPoints: number): GamificationAwardResultDto {
    return { enabled: false, awards: [], milestonesReached: [], badgesAwarded: [], totalPoints };
}

@Injectable()
export class GamificationService {
    async getSummary(userId: string): Promise<GamificationSummaryDto> {
        const totalPoints = await this.getTotalPoints(userId);
        const level = getLevelForPoints(totalPoints);
        const levelIndex = LEVELS.findIndex(entry => entry.level === level.level);
        const nextLevel = LEVELS[levelIndex + 1] ?? null;
        const pointsToNextLevel = nextLevel ? nextLevel.minPoints - totalPoints : null;
        const levelProgressPercentage = nextLevel
            ? Math.min(100, Math.round(((totalPoints - level.minPoints) / (nextLevel.minPoints - level.minPoints)) * 100))
            : 100;

        const lastTransaction = await prisma.pointsTransaction.findFirst({
            where: { userId, points: { gt: 0 } },
            orderBy: { awardedAt: "desc" },
        });
        const lastAward = lastTransaction
            ? {
                points: lastTransaction.points,
                reason: await this.describeTransaction(lastTransaction),
                awardedAt: lastTransaction.awardedAt.toISOString(),
            }
            : null;

        const recentBadgeRows = await prisma.userBadge.findMany({
            where: { userId },
            include: { badge: true },
            orderBy: { awardedAt: "desc" },
            take: 5,
        });
        const recentBadges: BadgeDto[] = recentBadgeRows.map(row => ({
            id: row.badge.id,
            code: row.badge.code,
            name: row.badge.name,
            description: row.badge.description,
            isSkillBadge: row.badge.isSkillBadge,
            awardedAt: row.awardedAt.toISOString(),
        }));

        const nextMilestoneDefinition = POINTS_MILESTONES.find(milestone => milestone.threshold > totalPoints) ?? null;
        const nextMilestone = nextMilestoneDefinition
            ? {
                threshold: nextMilestoneDefinition.threshold,
                pointsRemaining: nextMilestoneDefinition.threshold - totalPoints,
                label: nextMilestoneDefinition.label,
            }
            : null;

        const currentStreakWeeks = await this.computeStreakWeeks(userId, new Date());
        const howToEarnPoints = Object.values(PointsRule).map(rule => ({
            code: rule.code,
            points: rule.points,
            description: rule.description,
        }));

        return {
            enabled: true,
            totalPoints,
            level: level.level,
            levelName: level.name,
            nextLevelName: nextLevel?.name ?? null,
            pointsToNextLevel,
            levelProgressPercentage,
            lastAward,
            recentBadges,
            nextMilestone,
            currentStreakWeeks,
            howToEarnPoints,
        };
    }

    async getHistory(userId: string, limit = 50): Promise<PointsHistoryEntryDto[]> {
        const transactions = await prisma.pointsTransaction.findMany({
            where: { userId },
            orderBy: { awardedAt: "desc" },
            take: limit,
        });

        return Promise.all(
            transactions.map(async transaction => ({
                id: transaction.id,
                activityType: transaction.activityType,
                ruleCode: transaction.ruleCode,
                points: transaction.points,
                balanceAfter: transaction.balanceAfter,
                awardedAt: transaction.awardedAt.toISOString(),
                correctionReason: transaction.correctionReason,
                reason: await this.describeTransaction(transaction),
            }))
        );
    }

    /** Called once a lesson's completion has just been persisted (new completion only). */
    async onLessonCompleted(userId: string, lessonId: string): Promise<GamificationAwardResultDto> {
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                chapter: {
                    include: {
                        training: {
                            include: { chapters: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
                        },
                    },
                },
            },
        });
        if (!lesson) {
            throw new NotFoundException(`Lesson ${lessonId} was not found.`);
        }

        const training = lesson.chapter.training;
        const startBalance = await this.getTotalPoints(userId);

        if (!training.gamificationEnabled) {
            return disabledResult(startBalance);
        }

        const awards: PointsAwardDto[] = [];
        const badgesAwarded: BadgeDto[] = [];

        const streakResult = await this.recordActivityDayAndCheckStreak(userId);
        awards.push(...streakResult.awards);
        badgesAwarded.push(...streakResult.badgesAwarded);

        const allLessons = training.chapters.flatMap(chapter => chapter.lessons);
        const progressRows = await prisma.lessonProgress.findMany({
            where: { userId, lessonId: { in: allLessons.map(l => l.id) } },
        });
        const completedIds = new Set(progressRows.map(row => row.lessonId));
        const completedCount = completedIds.size;
        const progressAfter = allLessons.length === 0 ? 0 : Math.round((completedCount / allLessons.length) * 100);
        const progressBefore = allLessons.length === 0 ? 0 : Math.round(((completedCount - 1) / allLessons.length) * 100);

        const firstLesson = allLessons[0];
        if (firstLesson && firstLesson.id === lessonId) {
            const award = await this.awardPoints(
                userId,
                "LESSON",
                training.id,
                PointsRule.FIRST_LESSON.code,
                PointsRule.FIRST_LESSON.points,
                `Eerste les van ${training.title} afgerond`
            );
            if (award) awards.push(award);
        }

        if (progressBefore < 50 && progressAfter >= 50) {
            const award = await this.awardPoints(
                userId,
                "TRAINING",
                training.id,
                PointsRule.PROGRESS_50.code,
                PointsRule.PROGRESS_50.points,
                `50% voortgang bereikt in ${training.title}`
            );
            if (award) awards.push(award);
        }

        if (progressAfter === 100) {
            const award = await this.awardPoints(
                userId,
                "TRAINING",
                training.id,
                PointsRule.TRAINING_COMPLETE.code,
                PointsRule.TRAINING_COMPLETE.points,
                `${training.title} volledig afgerond`
            );
            if (award) awards.push(award);

            const completedTrainingBonuses = await this.awardCompletedTrainingBonuses(userId);
            awards.push(...completedTrainingBonuses.awards);
            badgesAwarded.push(...completedTrainingBonuses.badgesAwarded);

            const learningPathAwards = await this.checkLearningPathsForTraining(userId, training.id);
            awards.push(...learningPathAwards.awards);
            badgesAwarded.push(...learningPathAwards.badgesAwarded);

            const skillBadges = await this.checkSkillBadgesForTraining(userId, training.id);
            badgesAwarded.push(...skillBadges);
        }

        const { milestonesReached, endBalance, extraBadges } = await this.finalizeAwards(userId, startBalance, awards);
        badgesAwarded.push(...extraBadges);

        return { enabled: true, awards, milestonesReached, badgesAwarded, totalPoints: endBalance };
    }

    async onQuizSubmitted(
        userId: string,
        quizId: string,
        scorePercentage: number,
        passed: boolean
    ): Promise<GamificationAwardResultDto> {
        const quiz = await prisma.quiz.findUnique({ where: { id: quizId }, include: { training: true } });
        if (!quiz) {
            throw new NotFoundException(`Quiz ${quizId} was not found.`);
        }
        const training = quiz.training;
        const startBalance = await this.getTotalPoints(userId);

        if (!training.gamificationEnabled) {
            return disabledResult(startBalance);
        }

        const awards: PointsAwardDto[] = [];
        const badgesAwarded: BadgeDto[] = [];

        const streakResult = await this.recordActivityDayAndCheckStreak(userId);
        awards.push(...streakResult.awards);
        badgesAwarded.push(...streakResult.badgesAwarded);

        const deservedPoints = getQuizPointsForScore(scorePercentage, passed);
        if (deservedPoints > 0) {
            const previouslyAwarded = await this.getQuizAwardedPoints(userId, quizId);
            const diff = deservedPoints - previouslyAwarded;
            if (diff > 0) {
                const nextVersion = await this.getNextRuleVersion(userId, "QUIZ", quizId, QUIZ_RESULT_RULE_CODE);
                const award = await this.awardPoints(
                    userId,
                    "QUIZ",
                    quizId,
                    QUIZ_RESULT_RULE_CODE,
                    diff,
                    `Toets van ${training.title} behaald met ${scorePercentage}%`,
                    nextVersion
                );
                if (award) awards.push(award);
            }
        }

        if (passed && scorePercentage >= 100) {
            const badge = await this.awardBadge(userId, "PERFECTIONIST");
            if (badge) badgesAwarded.push(badge);
        }

        if (passed) {
            const skillBadges = await this.checkSkillBadgesForTraining(userId, training.id);
            badgesAwarded.push(...skillBadges);
        }

        const { milestonesReached, endBalance, extraBadges } = await this.finalizeAwards(userId, startBalance, awards);
        badgesAwarded.push(...extraBadges);

        return { enabled: true, awards, milestonesReached, badgesAwarded, totalPoints: endBalance };
    }

    private async finalizeAwards(
        userId: string,
        startBalance: number,
        awards: PointsAwardDto[]
    ): Promise<{ milestonesReached: MilestoneReachedDto[]; endBalance: number; extraBadges: BadgeDto[] }> {
        const totalAwarded = awards.reduce((sum, award) => sum + award.points, 0);
        const endBalance = startBalance + totalAwarded;
        const lastReason = awards.length > 0 ? awards[awards.length - 1].reason : "";
        const milestonesReached = this.checkMilestones(startBalance, endBalance, lastReason);

        const extraBadges: BadgeDto[] = [];
        if (milestonesReached.some(milestone => milestone.threshold === 10)) {
            const badge = await this.awardBadge(userId, "GOOD_START");
            if (badge) extraBadges.push(badge);
        }

        return { milestonesReached, endBalance, extraBadges };
    }

    private checkMilestones(
        balanceBefore: number,
        balanceAfter: number,
        triggeringReason: string
    ): MilestoneReachedDto[] {
        const reached: MilestoneReachedDto[] = [];
        for (const milestone of POINTS_MILESTONES) {
            if (balanceBefore < milestone.threshold && balanceAfter >= milestone.threshold) {
                reached.push({
                    threshold: milestone.threshold,
                    code: milestone.code,
                    label: milestone.label,
                    message:
                        milestone.threshold === 10
                            ? "Goed bezig! Je hebt je eerste 10 punten verdiend."
                            : `Mijlpaal bereikt: ${milestone.label} (${milestone.threshold} punten)!`,
                    reasonMessage: triggeringReason ? `Je verdiende punten door: ${triggeringReason}.` : null,
                });
            }
        }
        return reached;
    }

    private async awardCompletedTrainingBonuses(
        userId: string
    ): Promise<{ awards: PointsAwardDto[]; badgesAwarded: BadgeDto[] }> {
        const completedCount = await this.countCompletedTrainings(userId);
        const awards: PointsAwardDto[] = [];
        const badgesAwarded: BadgeDto[] = [];

        const milestoneRule = {
            1: { rule: PointsRule.FIRST_TRAINING_BONUS, badgeCode: "FIRST_STEP" },
            3: { rule: PointsRule.THREE_TRAININGS_BONUS, badgeCode: "PERSISTENT" },
            5: { rule: PointsRule.FIVE_TRAININGS_BONUS, badgeCode: "KNOWLEDGE_BUILDER" },
        }[completedCount];

        if (milestoneRule) {
            const award = await this.awardPoints(
                userId,
                "TRAINING_MILESTONE",
                "GLOBAL",
                milestoneRule.rule.code,
                milestoneRule.rule.points,
                milestoneRule.rule.description
            );
            if (award) awards.push(award);

            const badge = await this.awardBadge(userId, milestoneRule.badgeCode);
            if (badge) badgesAwarded.push(badge);
        }

        return { awards, badgesAwarded };
    }

    private async countCompletedTrainings(userId: string): Promise<number> {
        const trainings = await prisma.training.findMany({
            where: { status: "PUBLISHED" },
            include: { chapters: { include: { lessons: true } } },
        });
        const progress = await prisma.lessonProgress.findMany({ where: { userId } });
        const completedLessonIds = new Set(progress.map(row => row.lessonId));

        return trainings.filter(training => {
            const lessons = training.chapters.flatMap(chapter => chapter.lessons);
            return lessons.length > 0 && lessons.every(lesson => completedLessonIds.has(lesson.id));
        }).length;
    }

    private async checkLearningPathsForTraining(
        userId: string,
        trainingId: string
    ): Promise<{ awards: PointsAwardDto[]; badgesAwarded: BadgeDto[] }> {
        const memberships = await prisma.learningPathTraining.findMany({ where: { trainingId } });
        const awards: PointsAwardDto[] = [];
        const badgesAwarded: BadgeDto[] = [];

        for (const membership of memberships) {
            const path = await prisma.learningPath.findUnique({
                where: { id: membership.learningPathId },
                include: { trainings: { include: { training: { include: { chapters: { include: { lessons: true } } } } } } },
            });
            if (!path) continue;

            const allLessonIds = path.trainings.flatMap(entry =>
                entry.training.chapters.flatMap(chapter => chapter.lessons.map(l => l.id))
            );
            if (allLessonIds.length === 0) continue;

            const progress = await prisma.lessonProgress.findMany({ where: { userId, lessonId: { in: allLessonIds } } });
            const completedLessonIds = new Set(progress.map(row => row.lessonId));
            const isComplete = allLessonIds.every(id => completedLessonIds.has(id));
            if (!isComplete) continue;

            const award = await this.awardPoints(
                userId,
                "LEARNING_PATH",
                path.id,
                PointsRule.LEARNING_PATH_COMPLETE.code,
                PointsRule.LEARNING_PATH_COMPLETE.points,
                `Leerpad ${path.title} volledig afgerond`
            );
            if (award) awards.push(award);

            const badge = await this.awardBadge(userId, "LEARNING_PATH_COMPLETE");
            if (badge) badgesAwarded.push(badge);
        }

        return { awards, badgesAwarded };
    }

    private async checkSkillBadgesForTraining(userId: string, trainingId: string): Promise<BadgeDto[]> {
        const skillBadges = await prisma.badge.findMany({
            where: { requiredTrainingId: trainingId, isSkillBadge: true, isActive: true },
        });
        if (skillBadges.length === 0) {
            return [];
        }

        const training = await prisma.training.findUnique({
            where: { id: trainingId },
            include: { chapters: { include: { lessons: true } }, quiz: true },
        });
        if (!training) {
            return [];
        }

        const lessons = training.chapters.flatMap(chapter => chapter.lessons);
        const progress = await prisma.lessonProgress.findMany({
            where: { userId, lessonId: { in: lessons.map(l => l.id) } },
        });
        const allLessonsDone = lessons.length > 0 && progress.length === lessons.length;
        if (!allLessonsDone) {
            return [];
        }

        let bestQuizScore: number | null = null;
        if (training.quiz) {
            const bestAttempt = await prisma.quizAttempt.aggregate({
                where: { userId, quizId: training.quiz.id, passed: true },
                _max: { scorePercentage: true },
            });
            bestQuizScore = bestAttempt._max.scorePercentage ?? null;
        }

        const awarded: BadgeDto[] = [];
        for (const badge of skillBadges) {
            const minimumScore = badge.minimumScorePercentage ?? 0;
            const meetsQuizRequirement = training.quiz ? bestQuizScore !== null && bestQuizScore >= minimumScore : true;
            if (meetsQuizRequirement) {
                const awardedBadge = await this.awardBadge(userId, badge.code);
                if (awardedBadge) awarded.push(awardedBadge);
            }
        }
        return awarded;
    }

    private async recordActivityDayAndCheckStreak(
        userId: string
    ): Promise<{ awards: PointsAwardDto[]; badgesAwarded: BadgeDto[] }> {
        const today = toUtcMidnight(new Date());
        try {
            await prisma.learningActivityDay.create({ data: { userId, activityDate: today } });
        } catch (error) {
            if (isUniqueConstraintError(error)) {
                return { awards: [], badgesAwarded: [] };
            }
            throw error;
        }

        const streakWeeks = await this.computeStreakWeeks(userId, today);
        const awards: PointsAwardDto[] = [];
        const badgesAwarded: BadgeDto[] = [];

        for (const reward of STREAK_REWARDS) {
            if (streakWeeks >= reward.weeks) {
                const award = await this.awardPoints(
                    userId,
                    "STREAK",
                    "GLOBAL",
                    reward.ruleCode,
                    reward.points,
                    `${reward.weeks} actieve weken op rij`
                );
                if (award) {
                    awards.push(award);
                    if (reward.weeks === 8) {
                        const badge = await this.awardBadge(userId, "CONSISTENT_LEARNER");
                        if (badge) badgesAwarded.push(badge);
                    }
                }
            }
        }

        return { awards, badgesAwarded };
    }

    private async computeStreakWeeks(userId: string, anchor: Date): Promise<number> {
        const days = await prisma.learningActivityDay.findMany({ where: { userId }, select: { activityDate: true } });
        if (days.length === 0) {
            return 0;
        }
        const weekKeys = new Set(days.map(day => getIsoWeekKey(day.activityDate)));

        let cursor = toUtcMidnight(anchor);
        let streak = 0;
        while (weekKeys.has(getIsoWeekKey(cursor))) {
            streak += 1;
            cursor = previousWeekAnchor(cursor);
        }
        return streak;
    }

    private async getQuizAwardedPoints(userId: string, quizId: string): Promise<number> {
        const aggregate = await prisma.pointsTransaction.aggregate({
            where: { userId, activityType: "QUIZ", activityId: quizId },
            _sum: { points: true },
        });
        return aggregate._sum.points ?? 0;
    }

    private async getNextRuleVersion(
        userId: string,
        activityType: PointsActivityType,
        activityId: string,
        ruleCode: string
    ): Promise<number> {
        const count = await prisma.pointsTransaction.count({ where: { userId, activityType, activityId, ruleCode } });
        return count + 1;
    }

    private async getTotalPoints(userId: string): Promise<number> {
        const aggregate = await prisma.pointsTransaction.aggregate({ where: { userId }, _sum: { points: true } });
        return aggregate._sum.points ?? 0;
    }

    private async awardPoints(
        userId: string,
        activityType: PointsActivityType,
        activityId: string,
        ruleCode: string,
        points: number,
        reason: string,
        ruleVersion = 1
    ): Promise<PointsAwardDto | null> {
        if (points <= 0) {
            return null;
        }

        return prisma.$transaction(async tx => {
            const aggregate = await tx.pointsTransaction.aggregate({ where: { userId }, _sum: { points: true } });
            const balanceBefore = aggregate._sum.points ?? 0;
            const balanceAfter = balanceBefore + points;

            try {
                await tx.pointsTransaction.create({
                    data: { userId, activityType, activityId, ruleCode, ruleVersion, points, balanceBefore, balanceAfter },
                });
            } catch (error) {
                if (isUniqueConstraintError(error)) {
                    return null;
                }
                throw error;
            }

            return { ruleCode, points, reason, balanceAfter };
        });
    }

    private async awardBadge(userId: string, code: string): Promise<BadgeDto | null> {
        const badge = await prisma.badge.findUnique({ where: { code } });
        if (!badge || !badge.isActive) {
            return null;
        }

        try {
            const userBadge = await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
            return {
                id: badge.id,
                code: badge.code,
                name: badge.name,
                description: badge.description,
                isSkillBadge: badge.isSkillBadge,
                awardedAt: userBadge.awardedAt.toISOString(),
            };
        } catch (error) {
            if (isUniqueConstraintError(error)) {
                return null;
            }
            throw error;
        }
    }

    private async describeTransaction(transaction: {
        activityType: string;
        activityId: string;
        ruleCode: string;
    }): Promise<string> {
        if (transaction.ruleCode === PointsRule.FIRST_LESSON.code) {
            const title = await this.getTrainingTitle(transaction.activityId);
            return `het afronden van de eerste les van ${title}`;
        }
        if (transaction.ruleCode === PointsRule.PROGRESS_50.code) {
            const title = await this.getTrainingTitle(transaction.activityId);
            return `het bereiken van 50% voortgang in ${title}`;
        }
        if (transaction.ruleCode === PointsRule.TRAINING_COMPLETE.code) {
            const title = await this.getTrainingTitle(transaction.activityId);
            return `het afronden van de training ${title}`;
        }
        if (transaction.ruleCode === QUIZ_RESULT_RULE_CODE) {
            const quiz = await prisma.quiz.findUnique({ where: { id: transaction.activityId }, include: { training: true } });
            return `het behalen van de toets van ${quiz?.training.title ?? "een training"}`;
        }
        if (transaction.ruleCode === PointsRule.LEARNING_PATH_COMPLETE.code) {
            const path = await prisma.learningPath.findUnique({ where: { id: transaction.activityId } });
            return `het afronden van het leerpad ${path?.title ?? "onbekend leerpad"}`;
        }

        const rule = Object.values(PointsRule).find(candidate => candidate.code === transaction.ruleCode);
        return rule?.description ?? transaction.ruleCode;
    }

    private async getTrainingTitle(trainingId: string): Promise<string> {
        const training = await prisma.training.findUnique({ where: { id: trainingId }, select: { title: true } });
        return training?.title ?? "een training";
    }
}
