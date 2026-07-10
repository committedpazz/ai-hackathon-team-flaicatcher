import type { TrainingStatus } from "./training.dto.js";

export interface LearningPathTrainingSummaryDto {
    trainingId: string;
    title: string;
    order: number;
    progressPercentage: number;
    completed: boolean;
}

export interface LearningPathSummaryDto {
    id: string;
    title: string;
    description: string;
    status: TrainingStatus;
    trainingCount: number;
    progressPercentage: number;
    completed: boolean;
}

export interface LearningPathDetailDto {
    id: string;
    title: string;
    description: string;
    status: TrainingStatus;
    trainings: LearningPathTrainingSummaryDto[];
    progressPercentage: number;
    completed: boolean;
}

export interface CreateLearningPathRequest {
    title: string;
    description: string;
}

export interface UpdateLearningPathRequest {
    title?: string;
    description?: string;
}

export interface AddTrainingToLearningPathRequest {
    trainingId: string;
    order: number;
}

export interface AuthoredLearningPathSummaryDto {
    id: string;
    title: string;
    description: string;
    status: TrainingStatus;
    trainingCount: number;
}

export interface AuthoredLearningPathTrainingDto {
    trainingId: string;
    title: string;
    order: number;
}

export interface AuthoredLearningPathDetailDto {
    id: string;
    title: string;
    description: string;
    status: TrainingStatus;
    trainings: AuthoredLearningPathTrainingDto[];
}
