import type { AuthenticatedUser, LearningPathDetailDto, LearningPathSummaryDto } from "@cerios/shared-types";
import { Controller, Get, Param, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

import { LearningPathsService } from "./learning-paths.service";

@UseGuards(JwtAuthGuard)
@Controller("learning-paths")
export class LearningPathsController {
    constructor(private readonly learningPathsService: LearningPathsService) { }

    @Get()
    listLearningPaths(@CurrentUser() user: AuthenticatedUser): Promise<LearningPathSummaryDto[]> {
        return this.learningPathsService.listLearningPaths(user.id);
    }

    @Get(":learningPathId")
    getLearningPathDetail(
        @Param("learningPathId") learningPathId: string,
        @CurrentUser() user: AuthenticatedUser
    ): Promise<LearningPathDetailDto> {
        return this.learningPathsService.getLearningPathDetail(learningPathId, user.id);
    }
}
