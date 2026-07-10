import type { AuthenticatedUser, QuizAttemptResultDto, QuizDto } from "@cerios/shared-types";
import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

import { SubmitQuizAttemptDto } from "./dto/submit-quiz-attempt.dto";
import { QuizzesService } from "./quizzes.service";

@UseGuards(JwtAuthGuard)
@Controller("trainings/:trainingId/quiz")
export class QuizzesController {
    constructor(private readonly quizzesService: QuizzesService) { }

    @Get()
    async getQuiz(@Param("trainingId") trainingId: string, @CurrentUser() user: AuthenticatedUser): Promise<QuizDto> {
        const quiz = await this.quizzesService.getQuizForLearner(trainingId, user.id);
        if (!quiz) {
            throw new NotFoundException(`Training ${trainingId} has no quiz.`);
        }
        return quiz;
    }

    @Post("attempts")
    submitAttempt(
        @Param("trainingId") trainingId: string,
        @Body() dto: SubmitQuizAttemptDto,
        @CurrentUser() user: AuthenticatedUser
    ): Promise<QuizAttemptResultDto> {
        return this.quizzesService.submitAttempt(trainingId, user.id, dto);
    }
}
