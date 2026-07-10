import { Module } from "@nestjs/common";

import { GamificationModule } from "../gamification/gamification.module";

import { QuizzesController } from "./quizzes.controller";
import { QuizzesService } from "./quizzes.service";
import { TrainingAuthoringController } from "./training-authoring.controller";
import { TrainingAuthoringService } from "./training-authoring.service";
import { TrainingsController } from "./trainings.controller";
import { TrainingsService } from "./trainings.service";

@Module({
	imports: [GamificationModule],
	controllers: [TrainingsController, TrainingAuthoringController, QuizzesController],
	providers: [TrainingsService, TrainingAuthoringService, QuizzesService],
})
export class TrainingsModule { }
