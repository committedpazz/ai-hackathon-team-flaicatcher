import { prisma } from "@cerios/database";
import type {
	AuthoredTrainingSummaryDto,
	ChapterDto,
	CreateChapterRequest,
	CreateLessonRequest,
	CreateTrainingRequest,
	LessonDto,
	UpdateChapterRequest,
	UpdateLessonRequest,
	UpdateTrainingRequest,
} from "@cerios/shared-types";
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class TrainingAuthoringService {
	async listAuthoredTrainings(userId: string): Promise<AuthoredTrainingSummaryDto[]> {
		const trainings = await prisma.training.findMany({
			where: { createdByUserId: userId },
			include: { chapters: { include: { lessons: true } } },
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
			include: { chapters: { include: { lessons: true } } },
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
		};
	}

	async publishTraining(trainingId: string, userId: string): Promise<AuthoredTrainingSummaryDto> {
		await this.assertTrainingOwner(trainingId, userId);

		const training = await prisma.training.update({
			where: { id: trainingId },
			data: { status: "PUBLISHED" },
			include: { chapters: { include: { lessons: true } } },
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
