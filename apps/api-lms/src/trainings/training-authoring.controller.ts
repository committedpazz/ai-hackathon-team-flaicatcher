import type { AuthoredTrainingSummaryDto, AuthenticatedUser, ChapterDto, LessonDto } from "@cerios/shared-types";
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

import { CreateChapterDto } from "./dto/create-chapter.dto";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { CreateTrainingDto } from "./dto/create-training.dto";
import { UpdateChapterDto } from "./dto/update-chapter.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { UpdateTrainingDto } from "./dto/update-training.dto";
import { TrainingAuthoringService } from "./training-authoring.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("TRAINER")
@Controller("authoring")
export class TrainingAuthoringController {
    constructor(private readonly authoringService: TrainingAuthoringService) { }

    @Get("trainings")
    listAuthoredTrainings(@CurrentUser() user: AuthenticatedUser): Promise<AuthoredTrainingSummaryDto[]> {
        return this.authoringService.listAuthoredTrainings(user.id);
    }

    @Post("trainings")
    createTraining(
        @Body() dto: CreateTrainingDto,
        @CurrentUser() user: AuthenticatedUser
    ): Promise<AuthoredTrainingSummaryDto> {
        return this.authoringService.createTraining(user.id, dto);
    }

    @Patch("trainings/:trainingId")
    updateTraining(
        @Param("trainingId") trainingId: string,
        @Body() dto: UpdateTrainingDto,
        @CurrentUser() user: AuthenticatedUser
    ): Promise<AuthoredTrainingSummaryDto> {
        return this.authoringService.updateTraining(trainingId, user.id, dto);
    }

    @Post("trainings/:trainingId/publish")
    publishTraining(
        @Param("trainingId") trainingId: string,
        @CurrentUser() user: AuthenticatedUser
    ): Promise<AuthoredTrainingSummaryDto> {
        return this.authoringService.publishTraining(trainingId, user.id);
    }

    @Post("trainings/:trainingId/chapters")
    createChapter(
        @Param("trainingId") trainingId: string,
        @Body() dto: CreateChapterDto,
        @CurrentUser() user: AuthenticatedUser
    ): Promise<ChapterDto> {
        return this.authoringService.createChapter(trainingId, user.id, dto);
    }

    @Patch("chapters/:chapterId")
    updateChapter(
        @Param("chapterId") chapterId: string,
        @Body() dto: UpdateChapterDto,
        @CurrentUser() user: AuthenticatedUser
    ): Promise<ChapterDto> {
        return this.authoringService.updateChapter(chapterId, user.id, dto);
    }

    @Delete("chapters/:chapterId")
    deleteChapter(@Param("chapterId") chapterId: string, @CurrentUser() user: AuthenticatedUser): Promise<void> {
        return this.authoringService.deleteChapter(chapterId, user.id);
    }

    @Post("chapters/:chapterId/lessons")
    createLesson(
        @Param("chapterId") chapterId: string,
        @Body() dto: CreateLessonDto,
        @CurrentUser() user: AuthenticatedUser
    ): Promise<LessonDto> {
        return this.authoringService.createLesson(chapterId, user.id, dto);
    }

    @Patch("lessons/:lessonId")
    updateLesson(
        @Param("lessonId") lessonId: string,
        @Body() dto: UpdateLessonDto,
        @CurrentUser() user: AuthenticatedUser
    ): Promise<LessonDto> {
        return this.authoringService.updateLesson(lessonId, user.id, dto);
    }

    @Delete("lessons/:lessonId")
    deleteLesson(@Param("lessonId") lessonId: string, @CurrentUser() user: AuthenticatedUser): Promise<void> {
        return this.authoringService.deleteLesson(lessonId, user.id);
    }
}
