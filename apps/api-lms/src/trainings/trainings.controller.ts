import type {
	CompleteLessonResponse,
	TrainingDetailDto,
	TrainingSummaryDto,
	AuthenticatedUser,
} from "@cerios/shared-types";
import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

import { TrainingsService } from "./trainings.service";

@UseGuards(JwtAuthGuard)
@Controller("trainings")
export class TrainingsController {
	constructor(private readonly trainingsService: TrainingsService) {}

	@Get()
	listTrainings(@CurrentUser() user: AuthenticatedUser): Promise<TrainingSummaryDto[]> {
		return this.trainingsService.listTrainings(user.id);
	}

	@Get(":trainingId")
	getTrainingDetail(
		@Param("trainingId") trainingId: string,
		@CurrentUser() user: AuthenticatedUser
	): Promise<TrainingDetailDto> {
		return this.trainingsService.getTrainingDetail(trainingId, user.id);
	}

	@Post(":trainingId/lessons/:lessonId/complete")
	completeLesson(
		@Param("lessonId") lessonId: string,
		@CurrentUser() user: AuthenticatedUser
	): Promise<CompleteLessonResponse> {
		return this.trainingsService.completeLesson(lessonId, user.id);
	}
}
