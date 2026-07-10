import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { TrainingsModule } from "./trainings/trainings.module";

@Module({
  imports: [PrismaModule, AuthModule, TrainingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
