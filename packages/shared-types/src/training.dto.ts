// Modeled as a const object + derived union (not a TS `enum`) so it structurally
// matches the string union type Prisma generates for its own enums.
export const LessonContentType = {
	TEXT: "TEXT",
} as const;

export type LessonContentType = (typeof LessonContentType)[keyof typeof LessonContentType];

export const TrainingStatus = {
	DRAFT: "DRAFT",
	PUBLISHED: "PUBLISHED",
	ARCHIVED: "ARCHIVED",
} as const;

export type TrainingStatus = (typeof TrainingStatus)[keyof typeof TrainingStatus];

export interface LessonDto {
	id: string;
	chapterId: string;
	title: string;
	order: number;
	contentType: LessonContentType;
	contentBody: string;
	completedAt: string | null;
}

export interface ChapterDto {
	id: string;
	trainingId: string;
	title: string;
	order: number;
	lessons: LessonDto[];
}

export interface TrainingSummaryDto {
	id: string;
	title: string;
	description: string;
	level: string;
	language: string;
	progressPercentage: number;
}

export interface TrainingDetailDto {
	id: string;
	title: string;
	description: string;
	level: string;
	language: string;
	status: TrainingStatus;
	chapters: ChapterDto[];
	progressPercentage: number;
}

export interface CompleteLessonResponse {
	lessonId: string;
	completedAt: string;
}

export interface AuthoredTrainingSummaryDto {
	id: string;
	title: string;
	description: string;
	level: string;
	language: string;
	status: TrainingStatus;
	chapterCount: number;
	lessonCount: number;
}

export interface CreateTrainingRequest {
	title: string;
	description: string;
	level: string;
	language: string;
}

export interface UpdateTrainingRequest {
	title?: string;
	description?: string;
	level?: string;
	language?: string;
}

export interface CreateChapterRequest {
	title: string;
	order: number;
}

export interface UpdateChapterRequest {
	title?: string;
	order?: number;
}

export interface CreateLessonRequest {
	title: string;
	order: number;
	contentType: LessonContentType;
	contentBody: string;
}

export interface UpdateLessonRequest {
	title?: string;
	order?: number;
	contentType?: LessonContentType;
	contentBody?: string;
}
