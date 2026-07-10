import { prisma } from "@cerios/database";
import type { CompleteLessonResponse, TrainingDetailDto, TrainingSummaryDto } from "@cerios/shared-types";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class TrainingsService {
	async listTrainings(userId: string): Promise<TrainingSummaryDto[]> {
		const trainings = await prisma.training.findMany({
			where: { status: "PUBLISHED" },
			include: { chapters: { include: { lessons: true } } },
		});

		const lessonProgress = await prisma.lessonProgress.findMany({ where: { userId } });
		const completedLessonIds = new Set(lessonProgress.map(progress => progress.lessonId));

		return trainings.map(training => {
			const lessons = training.chapters.flatMap(chapter => chapter.lessons);
			const progressPercentage = calculateProgressPercentage(lessons, completedLessonIds);

			return {
				id: training.id,
				title: training.title,
				description: training.description,
				level: training.level,
				language: training.language,
				progressPercentage,
			};
		});
	}

	async getTrainingDetail(trainingId: string, userId: string): Promise<TrainingDetailDto> {
		const training = await prisma.training.findUnique({
			where: { id: trainingId },
			include: {
				chapters: {
					orderBy: { order: "asc" },
					include: { lessons: { orderBy: { order: "asc" } } },
				},
			},
		});

		if (!training) {
			throw new NotFoundException(`Training ${trainingId} was not found.`);
		}

		const lessonProgress = await prisma.lessonProgress.findMany({ where: { userId } });
		const completedByLessonId = new Map(lessonProgress.map(progress => [progress.lessonId, progress.completedAt]));

		const allLessons = training.chapters.flatMap(chapter => chapter.lessons);
		const progressPercentage = calculateProgressPercentage(allLessons, new Set(completedByLessonId.keys()));

		return {
			id: training.id,
			title: training.title,
			description: training.description,
			level: training.level,
			language: training.language,
			progressPercentage,
			chapters: training.chapters.map(chapter => ({
				id: chapter.id,
				trainingId: chapter.trainingId,
				title: chapter.title,
				order: chapter.order,
				lessons: chapter.lessons.map(lesson => ({
					id: lesson.id,
					chapterId: lesson.chapterId,
					title: lesson.title,
					order: lesson.order,
					contentType: lesson.contentType,
					contentBody: lesson.contentBody,
					completedAt: completedByLessonId.get(lesson.id)?.toISOString() ?? null,
				})),
			})),
		};
	}

	async completeLesson(lessonId: string, userId: string): Promise<CompleteLessonResponse> {
		const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
		if (!lesson) {
			throw new NotFoundException(`Lesson ${lessonId} was not found.`);
		}

		const progress = await prisma.lessonProgress.upsert({
			where: { userId_lessonId: { userId, lessonId } },
			update: { completedAt: new Date() },
			create: { userId, lessonId },
		});

		return { lessonId, completedAt: progress.completedAt.toISOString() };
	}
}

function calculateProgressPercentage(
	lessons: ReadonlyArray<{ id: string }>,
	completedLessonIds: ReadonlySet<string>
): number {
	if (lessons.length === 0) {
		return 0;
	}

	const completedCount = lessons.filter(lesson => completedLessonIds.has(lesson.id)).length;
	return Math.round((completedCount / lessons.length) * 100);
}
