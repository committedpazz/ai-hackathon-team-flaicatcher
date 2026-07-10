import type { AddTrainingToLearningPathRequest } from "@cerios/shared-types";
import { IsInt, IsString, Min } from "class-validator";

export class AddTrainingToLearningPathDto implements AddTrainingToLearningPathRequest {
    @IsString()
    trainingId!: string;

    @IsInt()
    @Min(1)
    order!: number;
}
