import type {
    AuthenticatedUser,
    AuthoredLearningPathDetailDto,
    AuthoredLearningPathSummaryDto,
} from "@cerios/shared-types";
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

import { AddTrainingToLearningPathDto } from "./dto/add-training-to-learning-path.dto";
import { CreateLearningPathDto } from "./dto/create-learning-path.dto";
import { UpdateLearningPathDto } from "./dto/update-learning-path.dto";
import { LearningPathAuthoringService } from "./learning-path-authoring.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("TRAINER")
@Controller("authoring/learning-paths")
export class LearningPathAuthoringController {
    constructor(private readonly authoringService: LearningPathAuthoringService) { }

    @Get()
    list(@CurrentUser() user: AuthenticatedUser): Promise<AuthoredLearningPathSummaryDto[]> {
        return this.authoringService.listAuthoredLearningPaths(user.id);
    }

    @Post()
    create(
        @Body() dto: CreateLearningPathDto,
        @CurrentUser() user: AuthenticatedUser
    ): Promise<AuthoredLearningPathSummaryDto> {
        return this.authoringService.createLearningPath(user.id, dto);
    }

    @Get(":learningPathId")
    getOne(
        @Param("learningPathId") learningPathId: string,
        @CurrentUser() user: AuthenticatedUser
    ): Promise<AuthoredLearningPathDetailDto> {
        return this.authoringService.getAuthoredLearningPath(learningPathId, user.id);
    }

    @Patch(":learningPathId")
    update(
        @Param("learningPathId") learningPathId: string,
        @Body() dto: UpdateLearningPathDto,
        @CurrentUser() user: AuthenticatedUser
    ): Promise<AuthoredLearningPathSummaryDto> {
        return this.authoringService.updateLearningPath(learningPathId, user.id, dto);
    }

    @Post(":learningPathId/publish")
    publish(
        @Param("learningPathId") learningPathId: string,
        @CurrentUser() user: AuthenticatedUser
    ): Promise<AuthoredLearningPathSummaryDto> {
        return this.authoringService.publishLearningPath(learningPathId, user.id);
    }

    @Delete(":learningPathId")
    remove(@Param("learningPathId") learningPathId: string, @CurrentUser() user: AuthenticatedUser): Promise<void> {
        return this.authoringService.deleteLearningPath(learningPathId, user.id);
    }

    @Post(":learningPathId/trainings")
    addTraining(
        @Param("learningPathId") learningPathId: string,
        @Body() dto: AddTrainingToLearningPathDto,
        @CurrentUser() user: AuthenticatedUser
    ): Promise<void> {
        return this.authoringService.addTraining(learningPathId, user.id, dto);
    }

    @Delete(":learningPathId/trainings/:trainingId")
    removeTraining(
        @Param("learningPathId") learningPathId: string,
        @Param("trainingId") trainingId: string,
        @CurrentUser() user: AuthenticatedUser
    ): Promise<void> {
        return this.authoringService.removeTraining(learningPathId, trainingId, user.id);
    }
}
