import { prisma } from "@cerios/database";
import type {
    AddTrainingToLearningPathRequest,
    AuthoredLearningPathDetailDto,
    AuthoredLearningPathSummaryDto,
    CreateLearningPathRequest,
    UpdateLearningPathRequest,
} from "@cerios/shared-types";
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class LearningPathAuthoringService {
    async listAuthoredLearningPaths(userId: string): Promise<AuthoredLearningPathSummaryDto[]> {
        const paths = await prisma.learningPath.findMany({
            where: { createdByUserId: userId },
            include: { trainings: true },
            orderBy: { createdAt: "desc" },
        });

        return paths.map(path => ({
            id: path.id,
            title: path.title,
            description: path.description,
            status: path.status,
            trainingCount: path.trainings.length,
        }));
    }

    async getAuthoredLearningPath(learningPathId: string, userId: string): Promise<AuthoredLearningPathDetailDto> {
        await this.assertOwner(learningPathId, userId);
        const path = await prisma.learningPath.findUniqueOrThrow({
            where: { id: learningPathId },
            include: { trainings: { orderBy: { order: "asc" }, include: { training: true } } },
        });

        return {
            id: path.id,
            title: path.title,
            description: path.description,
            status: path.status,
            trainings: path.trainings.map(entry => ({
                trainingId: entry.trainingId,
                title: entry.training.title,
                order: entry.order,
            })),
        };
    }

    async createLearningPath(
        userId: string,
        request: CreateLearningPathRequest
    ): Promise<AuthoredLearningPathSummaryDto> {
        const path = await prisma.learningPath.create({ data: { ...request, createdByUserId: userId } });
        return { id: path.id, title: path.title, description: path.description, status: path.status, trainingCount: 0 };
    }

    async updateLearningPath(
        learningPathId: string,
        userId: string,
        request: UpdateLearningPathRequest
    ): Promise<AuthoredLearningPathSummaryDto> {
        await this.assertOwner(learningPathId, userId);
        const path = await prisma.learningPath.update({
            where: { id: learningPathId },
            data: request,
            include: { trainings: true },
        });
        return {
            id: path.id,
            title: path.title,
            description: path.description,
            status: path.status,
            trainingCount: path.trainings.length,
        };
    }

    async publishLearningPath(learningPathId: string, userId: string): Promise<AuthoredLearningPathSummaryDto> {
        await this.assertOwner(learningPathId, userId);
        const path = await prisma.learningPath.update({
            where: { id: learningPathId },
            data: { status: "PUBLISHED" },
            include: { trainings: true },
        });
        return {
            id: path.id,
            title: path.title,
            description: path.description,
            status: path.status,
            trainingCount: path.trainings.length,
        };
    }

    async deleteLearningPath(learningPathId: string, userId: string): Promise<void> {
        await this.assertOwner(learningPathId, userId);
        await prisma.learningPath.delete({ where: { id: learningPathId } });
    }

    async addTraining(learningPathId: string, userId: string, request: AddTrainingToLearningPathRequest): Promise<void> {
        await this.assertOwner(learningPathId, userId);

        const training = await prisma.training.findUnique({ where: { id: request.trainingId } });
        if (!training) {
            throw new NotFoundException(`Training ${request.trainingId} was not found.`);
        }

        const existing = await prisma.learningPathTraining.findUnique({
            where: { learningPathId_trainingId: { learningPathId, trainingId: request.trainingId } },
        });
        if (existing) {
            throw new BadRequestException("This training is already part of the learning path.");
        }

        await prisma.learningPathTraining.create({
            data: { learningPathId, trainingId: request.trainingId, order: request.order },
        });
    }

    async removeTraining(learningPathId: string, trainingId: string, userId: string): Promise<void> {
        await this.assertOwner(learningPathId, userId);
        await prisma.learningPathTraining.deleteMany({ where: { learningPathId, trainingId } });
    }

    private async assertOwner(learningPathId: string, userId: string): Promise<void> {
        const path = await prisma.learningPath.findUnique({ where: { id: learningPathId } });
        if (!path) {
            throw new NotFoundException(`Learning path ${learningPathId} was not found.`);
        }
        if (path.createdByUserId && path.createdByUserId !== userId) {
            throw new ForbiddenException("You do not own this learning path.");
        }
    }
}
