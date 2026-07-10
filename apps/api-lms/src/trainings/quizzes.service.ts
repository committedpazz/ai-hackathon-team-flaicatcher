import { prisma } from "@cerios/database";
import type { QuizAttemptResultDto, QuizDto, SubmitQuizAttemptRequest } from "@cerios/shared-types";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { GamificationService } from "../gamification/gamification.service";

@Injectable()
export class QuizzesService {
    constructor(private readonly gamificationService: GamificationService) { }

    async getQuizForLearner(trainingId: string, userId: string): Promise<QuizDto | null> {
        const quiz = await prisma.quiz.findUnique({
            where: { trainingId },
            include: { questions: { orderBy: { order: "asc" }, include: { options: { orderBy: { order: "asc" } } } } },
        });
        if (!quiz) {
            return null;
        }

        const attempts = await prisma.quizAttempt.findMany({ where: { quizId: quiz.id, userId } });
        const bestScorePercentage =
            attempts.length === 0 ? null : Math.max(...attempts.map(attempt => attempt.scorePercentage));
        const passed = attempts.some(attempt => attempt.passed);

        return {
            id: quiz.id,
            trainingId: quiz.trainingId,
            title: quiz.title,
            passingScorePercentage: quiz.passingScorePercentage,
            questions: quiz.questions.map(question => ({
                id: question.id,
                text: question.text,
                order: question.order,
                options: question.options.map(option => ({ id: option.id, text: option.text, order: option.order })),
            })),
            bestScorePercentage,
            passed,
            attemptsCount: attempts.length,
        };
    }

    async submitAttempt(
        trainingId: string,
        userId: string,
        request: SubmitQuizAttemptRequest
    ): Promise<QuizAttemptResultDto> {
        const quiz = await prisma.quiz.findUnique({
            where: { trainingId },
            include: { questions: { include: { options: true } } },
        });
        if (!quiz) {
            throw new NotFoundException(`Training ${trainingId} has no quiz.`);
        }
        if (quiz.questions.length === 0) {
            throw new BadRequestException("This quiz has no questions yet.");
        }

        const answerByQuestionId = new Map(request.answers.map(answer => [answer.questionId, answer.optionId]));
        let correctCount = 0;
        for (const question of quiz.questions) {
            const chosenOptionId = answerByQuestionId.get(question.id);
            const correctOption = question.options.find(option => option.isCorrect);
            if (chosenOptionId && correctOption && chosenOptionId === correctOption.id) {
                correctCount += 1;
            }
        }

        const scorePercentage = Math.round((correctCount / quiz.questions.length) * 100);
        const passed = scorePercentage >= quiz.passingScorePercentage;

        await prisma.quizAttempt.create({ data: { quizId: quiz.id, userId, scorePercentage, passed } });

        const gamification = await this.gamificationService.onQuizSubmitted(userId, quiz.id, scorePercentage, passed);

        const bestAttempt = await prisma.quizAttempt.aggregate({
            where: { quizId: quiz.id, userId },
            _max: { scorePercentage: true },
        });

        return {
            scorePercentage,
            passed,
            correctCount,
            totalQuestions: quiz.questions.length,
            bestScorePercentage: bestAttempt._max.scorePercentage ?? scorePercentage,
            gamification,
        };
    }
}
