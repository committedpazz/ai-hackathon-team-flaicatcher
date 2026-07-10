import { Prisma, prisma } from "@cerios/database";
import type {
    AuthoredQuizDto,
    AuthoredTrainingSummaryDto,
    ChapterDto,
    CreateChapterRequest,
    CreateLessonRequest,
    CreateQuizRequest,
    CreateTrainingRequest,
    LessonDto,
    UpdateChapterRequest,
    UpdateLessonRequest,
    UpdateTrainingRequest,
} from "@cerios/shared-types";
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

type QuizWithQuestions = Prisma.QuizGetPayload<{
    include: { questions: { include: { options: true } } };
}>;

@Injectable()
export class TrainingAuthoringService {
    async listAuthoredTrainings(userId: string): Promise<AuthoredTrainingSummaryDto[]> {
        const trainings = await prisma.training.findMany({
            where: { createdByUserId: userId },
            include: { chapters: { include: { lessons: true } }, quiz: true },
            orderBy: { createdAt: "desc" },
        });

        return trainings.map(training => ({
            id: training.id,
            title: training.title,
            description: training.description,
            level: training.level,
            language: training.language,
            status: training.status,
            chapterCount: training.chapters.length,
            lessonCount: training.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0),
            gamificationEnabled: training.gamificationEnabled,
            hasQuiz: training.quiz !== null,
        }));
    }

    async createTraining(userId: string, request: CreateTrainingRequest): Promise<AuthoredTrainingSummaryDto> {
        const training = await prisma.training.create({
            data: { ...request, createdByUserId: userId },
        });

        return {
            id: training.id,
            title: training.title,
            description: training.description,
            level: training.level,
            language: training.language,
            status: training.status,
            chapterCount: 0,
            lessonCount: 0,
            gamificationEnabled: training.gamificationEnabled,
            hasQuiz: false,
        };
    }

    /**
     * L&D-only: permanently removes a training (and its chapters/lessons/progress
     * via cascading deletes) regardless of who authored it. No ownership check —
     * L&D has content-quality oversight across all trainings.
     */
    async deleteTraining(trainingId: string): Promise<void> {
        const training = await prisma.training.findUnique({ where: { id: trainingId } });
        if (!training) {
            throw new NotFoundException(`Training ${trainingId} was not found.`);
        }
        await prisma.training.delete({ where: { id: trainingId } });
    }

    async updateTraining(
        trainingId: string,
        userId: string,
        request: UpdateTrainingRequest
    ): Promise<AuthoredTrainingSummaryDto> {
        await this.assertTrainingOwner(trainingId, userId);

        const training = await prisma.training.update({
            where: { id: trainingId },
            data: request,
            include: { chapters: { include: { lessons: true } }, quiz: true },
        });

        return {
            id: training.id,
            title: training.title,
            description: training.description,
            level: training.level,
            language: training.language,
            status: training.status,
            chapterCount: training.chapters.length,
            lessonCount: training.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0),
            gamificationEnabled: training.gamificationEnabled,
            hasQuiz: training.quiz !== null,
        };
    }

    async publishTraining(trainingId: string, userId: string): Promise<AuthoredTrainingSummaryDto> {
        await this.assertTrainingOwner(trainingId, userId);

        const training = await prisma.training.update({
            where: { id: trainingId },
            data: { status: "PUBLISHED" },
            include: { chapters: { include: { lessons: true } }, quiz: true },
        });

        return {
            id: training.id,
            title: training.title,
            description: training.description,
            level: training.level,
            language: training.language,
            status: training.status,
            chapterCount: training.chapters.length,
            lessonCount: training.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0),
            gamificationEnabled: training.gamificationEnabled,
            hasQuiz: training.quiz !== null,
        };
    }

    async getAuthoredQuiz(trainingId: string, userId: string): Promise<AuthoredQuizDto | null> {
        await this.assertTrainingOwner(trainingId, userId);
        const quiz = await prisma.quiz.findUnique({
            where: { trainingId },
            include: { questions: { orderBy: { order: "asc" }, include: { options: { orderBy: { order: "asc" } } } } },
        });
        return quiz ? this.mapQuizToAuthoredDto(quiz) : null;
    }

    async upsertQuiz(trainingId: string, userId: string, request: CreateQuizRequest): Promise<AuthoredQuizDto> {
        await this.assertTrainingOwner(trainingId, userId);

        for (const question of request.questions) {
            if (!question.options.some(option => option.isCorrect)) {
                throw new BadRequestException(`Question "${question.text}" needs at least one correct option.`);
            }
        }

        const quiz = await prisma.$transaction(async tx => {
            const existing = await tx.quiz.findUnique({ where: { trainingId } });
            const quizRecord = existing
                ? await tx.quiz.update({
                    where: { trainingId },
                    data: { title: request.title, passingScorePercentage: request.passingScorePercentage },
                })
                : await tx.quiz.create({
                    data: { trainingId, title: request.title, passingScorePercentage: request.passingScorePercentage },
                });

            if (existing) {
                await tx.quizQuestion.deleteMany({ where: { quizId: quizRecord.id } });
            }

            for (const question of request.questions) {
                await tx.quizQuestion.create({
                    data: {
                        quizId: quizRecord.id,
                        text: question.text,
                        order: question.order,
                        options: {
                            create: question.options.map(option => ({
                                text: option.text,
                                isCorrect: option.isCorrect,
                                order: option.order,
                            })),
                        },
                    },
                });
            }

            return tx.quiz.findUniqueOrThrow({
                where: { id: quizRecord.id },
                include: { questions: { orderBy: { order: "asc" }, include: { options: { orderBy: { order: "asc" } } } } },
            });
        });

        return this.mapQuizToAuthoredDto(quiz);
    }

    async deleteQuiz(trainingId: string, userId: string): Promise<void> {
        await this.assertTrainingOwner(trainingId, userId);
        await prisma.quiz.deleteMany({ where: { trainingId } });
    }

    private mapQuizToAuthoredDto(quiz: QuizWithQuestions): AuthoredQuizDto {
        return {
            id: quiz.id,
            trainingId: quiz.trainingId,
            title: quiz.title,
            passingScorePercentage: quiz.passingScorePercentage,
            questions: quiz.questions.map(question => ({
                id: question.id,
                text: question.text,
                order: question.order,
                options: question.options.map(option => ({
                    id: option.id,
                    text: option.text,
                    isCorrect: option.isCorrect,
                    order: option.order,
                })),
            })),
        };
    }

    async createChapter(trainingId: string, userId: string, request: CreateChapterRequest): Promise<ChapterDto> {
        await this.assertTrainingOwner(trainingId, userId);

        const chapter = await prisma.chapter.create({
            data: { ...request, trainingId },
        });

        return { id: chapter.id, trainingId: chapter.trainingId, title: chapter.title, order: chapter.order, lessons: [] };
    }

    async updateChapter(chapterId: string, userId: string, request: UpdateChapterRequest): Promise<ChapterDto> {
        await this.assertChapterOwner(chapterId, userId);

        const updated = await prisma.chapter.update({
            where: { id: chapterId },
            data: request,
            include: { lessons: { orderBy: { order: "asc" } } },
        });

        return {
            id: updated.id,
            trainingId: updated.trainingId,
            title: updated.title,
            order: updated.order,
            lessons: updated.lessons.map(lesson => ({
                id: lesson.id,
                chapterId: lesson.chapterId,
                title: lesson.title,
                order: lesson.order,
                contentType: lesson.contentType,
                contentBody: lesson.contentBody,
                completedAt: null,
            })),
        };
    }

    async deleteChapter(chapterId: string, userId: string): Promise<void> {
        await this.assertChapterOwner(chapterId, userId);
        await prisma.chapter.delete({ where: { id: chapterId } });
    }

    async createLesson(chapterId: string, userId: string, request: CreateLessonRequest): Promise<LessonDto> {
        await this.assertChapterOwner(chapterId, userId);

        const lesson = await prisma.lesson.create({
            data: { ...request, chapterId },
        });

        return {
            id: lesson.id,
            chapterId: lesson.chapterId,
            title: lesson.title,
            order: lesson.order,
            contentType: lesson.contentType,
            contentBody: lesson.contentBody,
            completedAt: null,
        };
    }

    async updateLesson(lessonId: string, userId: string, request: UpdateLessonRequest): Promise<LessonDto> {
        await this.assertLessonOwner(lessonId, userId);

        const lesson = await prisma.lesson.update({ where: { id: lessonId }, data: request });

        return {
            id: lesson.id,
            chapterId: lesson.chapterId,
            title: lesson.title,
            order: lesson.order,
            contentType: lesson.contentType,
            contentBody: lesson.contentBody,
            completedAt: null,
        };
    }

    async deleteLesson(lessonId: string, userId: string): Promise<void> {
        await this.assertLessonOwner(lessonId, userId);
        await prisma.lesson.delete({ where: { id: lessonId } });
    }

    private async assertTrainingOwner(trainingId: string, userId: string): Promise<void> {
        const training = await prisma.training.findUnique({ where: { id: trainingId } });
        if (!training) {
            throw new NotFoundException(`Training ${trainingId} was not found.`);
        }
        if (training.createdByUserId && training.createdByUserId !== userId) {
            throw new ForbiddenException("You do not own this training.");
        }
    }

    private async assertChapterOwner(chapterId: string, userId: string): Promise<{ trainingId: string }> {
        const chapter = await prisma.chapter.findUnique({ where: { id: chapterId }, include: { training: true } });
        if (!chapter) {
            throw new NotFoundException(`Chapter ${chapterId} was not found.`);
        }
        if (chapter.training.createdByUserId && chapter.training.createdByUserId !== userId) {
            throw new ForbiddenException("You do not own this training.");
        }
        return { trainingId: chapter.trainingId };
    }

    private async assertLessonOwner(lessonId: string, userId: string): Promise<void> {
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { chapter: { include: { training: true } } },
        });
        if (!lesson) {
            throw new NotFoundException(`Lesson ${lessonId} was not found.`);
        }
        if (lesson.chapter.training.createdByUserId && lesson.chapter.training.createdByUserId !== userId) {
            throw new ForbiddenException("You do not own this training.");
        }
    }
}
