import { Module } from "@nestjs/common";

import { LearningPathAuthoringController } from "./learning-path-authoring.controller";
import { LearningPathAuthoringService } from "./learning-path-authoring.service";
import { LearningPathsController } from "./learning-paths.controller";
import { LearningPathsService } from "./learning-paths.service";

@Module({
    controllers: [LearningPathsController, LearningPathAuthoringController],
    providers: [LearningPathsService, LearningPathAuthoringService],
})
export class LearningPathsModule { }
