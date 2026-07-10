import { prisma } from "@cerios/database";
import type { LearningPathDetailDto, LearningPathSummaryDto } from "@cerios/shared-types";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class LearningPathsService {
    async listLearningPaths(userId: string): Promise<LearningPathSummaryDto[]> {
        const paths = await prisma.learningPath.findMany({
            where: { status: "PUBLISHED" },
            include: {
                trainings: {
                    orderBy: { order: "asc" },
                    include: { training: { include: { chapters: { include: { lessons: true } } } } },
                },
            },
        });

        const progress = await prisma.lessonProgress.findMany({ where: { userId } });
        const completedLessonIds = new Set(progress.map(row => row.lessonId));

        return paths.map(path => {
            const allLessons = path.trainings.flatMap(entry => entry.training.chapters.flatMap(chapter => chapter.lessons));
            const completedCount = allLessons.filter(lesson => completedLessonIds.has(lesson.id)).length;
            const progressPercentage = allLessons.length === 0 ? 0 : Math.round((completedCount / allLessons.length) * 100);

            return {
                id: path.id,
                title: path.title,
                description: path.description,
                status: path.status,
                trainingCount: path.trainings.length,
                progressPercentage,
                completed: allLessons.length > 0 && progressPercentage === 100,
            };
        });
    }

    async getLearningPathDetail(learningPathId: string, userId: string): Promise<LearningPathDetailDto> {
        const path = await prisma.learningPath.findUnique({
            where: { id: learningPathId },
            include: {
                trainings: {
                    orderBy: { order: "asc" },
                    include: { training: { include: { chapters: { include: { lessons: true } } } } },
                },
            },
        });
        if (!path) {
            throw new NotFoundException(`Learning path ${learningPathId} was not found.`);
        }

        const progress = await prisma.lessonProgress.findMany({ where: { userId } });
        const completedLessonIds = new Set(progress.map(row => row.lessonId));

        const trainings = path.trainings.map(entry => {
            const lessons = entry.training.chapters.flatMap(chapter => chapter.lessons);
            const completedCount = lessons.filter(lesson => completedLessonIds.has(lesson.id)).length;
            const progressPercentage = lessons.length === 0 ? 0 : Math.round((completedCount / lessons.length) * 100);
            return {
                trainingId: entry.trainingId,
                title: entry.training.title,
                order: entry.order,
                progressPercentage,
                completed: lessons.length > 0 && progressPercentage === 100,
            };
        });

        const allLessons = path.trainings.flatMap(entry => entry.training.chapters.flatMap(chapter => chapter.lessons));
        const completedCount = allLessons.filter(lesson => completedLessonIds.has(lesson.id)).length;
        const overallProgress = allLessons.length === 0 ? 0 : Math.round((completedCount / allLessons.length) * 100);

        return {
            id: path.id,
            title: path.title,
            description: path.description,
            status: path.status,
            trainings,
            progressPercentage: overallProgress,
            completed: allLessons.length > 0 && overallProgress === 100,
        };
    }
}
