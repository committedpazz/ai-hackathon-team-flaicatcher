export const PointsActivityType = {
    LESSON: "LESSON",
    TRAINING: "TRAINING",
    QUIZ: "QUIZ",
    LEARNING_PATH: "LEARNING_PATH",
    TRAINING_MILESTONE: "TRAINING_MILESTONE",
    STREAK: "STREAK",
} as const;

export type PointsActivityType = (typeof PointsActivityType)[keyof typeof PointsActivityType];

/** Standard, one-off point rules. See spec 5.5.2 / 5.5.3. */
export const PointsRule = {
    FIRST_LESSON: { code: "FIRST_LESSON", points: 1, description: "Eerste les van deze training afgerond" },
    PROGRESS_50: { code: "PROGRESS_50", points: 2, description: "50% van deze training bereikt" },
    TRAINING_COMPLETE: { code: "TRAINING_COMPLETE", points: 5, description: "Training volledig afgerond" },
    LEARNING_PATH_COMPLETE: { code: "LEARNING_PATH_COMPLETE", points: 10, description: "Volledig leerpad afgerond" },
    FIRST_TRAINING_BONUS: { code: "FIRST_TRAINING_BONUS", points: 5, description: "Eerste training ooit afgerond" },
    THREE_TRAININGS_BONUS: { code: "THREE_TRAININGS_BONUS", points: 5, description: "Drie trainingen afgerond" },
    FIVE_TRAININGS_BONUS: { code: "FIVE_TRAININGS_BONUS", points: 10, description: "Vijf trainingen afgerond" },
    STREAK_2_WEEKS: { code: "STREAK_2_WEEKS", points: 2, description: "Twee actieve weken op rij" },
    STREAK_4_WEEKS: { code: "STREAK_4_WEEKS", points: 5, description: "Vier actieve weken op rij" },
    STREAK_8_WEEKS: { code: "STREAK_8_WEEKS", points: 10, description: "Acht actieve weken op rij" },
} as const;

export const QUIZ_RESULT_RULE_CODE = "QUIZ_RESULT";

/** Tiered, non-cumulative quiz scoring per spec 5.5.3. */
export function getQuizPointsForScore(scorePercentage: number, passed: boolean): number {
    if (!passed) {
        return 0;
    }
    if (scorePercentage >= 100) {
        return 6;
    }
    if (scorePercentage >= 80) {
        return 5;
    }
    return 3;
}

export interface PointsMilestoneDefinition {
    threshold: number;
    code: string;
    label: string;
}

/** Point-total milestones that trigger a one-time congratulation. See spec 5.5.4. */
export const POINTS_MILESTONES: PointsMilestoneDefinition[] = [
    { threshold: 10, code: "MILESTONE_10", label: "Goede start" },
    { threshold: 25, code: "MILESTONE_25", label: "Actieve learner" },
    { threshold: 50, code: "MILESTONE_50", label: "Ervaren learner" },
    { threshold: 100, code: "MILESTONE_100", label: "Learning champion" },
];

export interface LevelDefinition {
    level: number;
    name: string;
    minPoints: number;
}

/** Levels derived purely from total points. See spec 5.5.6. */
export const LEVELS: LevelDefinition[] = [
    { level: 1, name: "Starter", minPoints: 0 },
    { level: 2, name: "Explorer", minPoints: 10 },
    { level: 3, name: "Learner", minPoints: 25 },
    { level: 4, name: "Specialist", minPoints: 50 },
    { level: 5, name: "Expert", minPoints: 100 },
];

export function getLevelForPoints(totalPoints: number): LevelDefinition {
    let current = LEVELS[0];
    for (const level of LEVELS) {
        if (totalPoints >= level.minPoints) {
            current = level;
        }
    }
    return current;
}

export const STREAK_REWARDS = [
    { weeks: 2, ruleCode: PointsRule.STREAK_2_WEEKS.code, points: PointsRule.STREAK_2_WEEKS.points },
    { weeks: 4, ruleCode: PointsRule.STREAK_4_WEEKS.code, points: PointsRule.STREAK_4_WEEKS.points },
    { weeks: 8, ruleCode: PointsRule.STREAK_8_WEEKS.code, points: PointsRule.STREAK_8_WEEKS.points },
] as const;

export interface BadgeDto {
    id: string;
    code: string;
    name: string;
    description: string;
    isSkillBadge: boolean;
    awardedAt: string | null;
}

export interface PointsAwardDto {
    ruleCode: string;
    points: number;
    reason: string;
    balanceAfter: number;
}

export interface MilestoneReachedDto {
    threshold: number;
    code: string;
    label: string;
    message: string;
    reasonMessage: string | null;
}

export interface GamificationAwardResultDto {
    enabled: boolean;
    awards: PointsAwardDto[];
    milestonesReached: MilestoneReachedDto[];
    badgesAwarded: BadgeDto[];
    totalPoints: number;
}

export interface PointsHistoryEntryDto {
    id: string;
    activityType: PointsActivityType;
    ruleCode: string;
    points: number;
    balanceAfter: number;
    awardedAt: string;
    correctionReason: string | null;
    reason: string;
}

export interface GamificationSummaryDto {
    enabled: boolean;
    totalPoints: number;
    level: number;
    levelName: string;
    nextLevelName: string | null;
    pointsToNextLevel: number | null;
    levelProgressPercentage: number;
    lastAward: { points: number; reason: string; awardedAt: string } | null;
    recentBadges: BadgeDto[];
    nextMilestone: { threshold: number; pointsRemaining: number; label: string } | null;
    currentStreakWeeks: number;
    howToEarnPoints: Array<{ code: string; points: number; description: string }>;
}
