// Modeled as a const object + derived union (not a TS `enum`) so it structurally
// matches the string union type Prisma generates for its own enums.
export const LessonContentType = {
    TEXT: "TEXT",
} as const;

export type LessonContentType = (typeof LessonContentType)[keyof typeof LessonContentType];

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
    chapters: ChapterDto[];
    progressPercentage: number;
}

export interface CompleteLessonResponse {
    lessonId: string;
    completedAt: string;
}
