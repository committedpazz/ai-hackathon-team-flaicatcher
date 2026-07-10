import { prisma, PrismaClient } from "@cerios/database";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    readonly client: PrismaClient = prisma;

    async onModuleInit(): Promise<void> {
        await this.client.$connect();
    }

    async onModuleDestroy(): Promise<void> {
        await this.client.$disconnect();
    }
}
