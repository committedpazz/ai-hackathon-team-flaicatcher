import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { GamificationModule } from "./gamification/gamification.module";
import { LearningPathsModule } from "./learning-paths/learning-paths.module";
import { PrismaModule } from "./prisma/prisma.module";
import { TrainingsModule } from "./trainings/trainings.module";

@Module({
	imports: [PrismaModule, AuthModule, GamificationModule, TrainingsModule, LearningPathsModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
