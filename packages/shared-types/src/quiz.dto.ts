import type { GamificationAwardResultDto } from "./gamification.dto.js";

export interface QuizOptionDto {
    id: string;
    text: string;
    order: number;
}

export interface QuizQuestionDto {
    id: string;
    text: string;
    order: number;
    options: QuizOptionDto[];
}

/** Learner-facing quiz shape. Correct answers are never included. */
export interface QuizDto {
    id: string;
    trainingId: string;
    title: string;
    passingScorePercentage: number;
    questions: QuizQuestionDto[];
    bestScorePercentage: number | null;
    passed: boolean;
    attemptsCount: number;
}

export interface SubmitQuizAnswer {
    questionId: string;
    optionId: string;
}

export interface SubmitQuizAttemptRequest {
    answers: SubmitQuizAnswer[];
}

export interface QuizAttemptResultDto {
    scorePercentage: number;
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
    bestScorePercentage: number;
    gamification: GamificationAwardResultDto | null;
}

export interface QuizOptionInput {
    text: string;
    isCorrect: boolean;
    order: number;
}

export interface QuizQuestionInput {
    text: string;
    order: number;
    options: QuizOptionInput[];
}

export interface CreateQuizRequest {
    title: string;
    passingScorePercentage: number;
    questions: QuizQuestionInput[];
}

export interface UpdateQuizRequest {
    title?: string;
    passingScorePercentage?: number;
    questions?: QuizQuestionInput[];
}

export interface AuthoredQuizOptionDto {
    id: string;
    text: string;
    isCorrect: boolean;
    order: number;
}

export interface AuthoredQuizQuestionDto {
    id: string;
    text: string;
    order: number;
    options: AuthoredQuizOptionDto[];
}

/** Trainer/authoring-facing quiz shape. Includes which options are correct. */
export interface AuthoredQuizDto {
    id: string;
    trainingId: string;
    title: string;
    passingScorePercentage: number;
    questions: AuthoredQuizQuestionDto[];
}
