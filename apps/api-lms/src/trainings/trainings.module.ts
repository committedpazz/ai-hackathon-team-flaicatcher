import { Module } from "@nestjs/common";

import { TrainingAuthoringController } from "./training-authoring.controller";
import { TrainingAuthoringService } from "./training-authoring.service";
import { TrainingsController } from "./trainings.controller";
import { TrainingsService } from "./trainings.service";

@Module({
	controllers: [TrainingsController, TrainingAuthoringController],
	providers: [TrainingsService, TrainingAuthoringService],
})
export class TrainingsModule {}
