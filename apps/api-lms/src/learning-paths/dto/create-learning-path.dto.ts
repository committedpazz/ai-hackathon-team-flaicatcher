import type { CreateLearningPathRequest } from "@cerios/shared-types";
import { IsString, MinLength } from "class-validator";

export class CreateLearningPathDto implements CreateLearningPathRequest {
    @IsString()
    @MinLength(1)
    title!: string;

    @IsString()
    description!: string;
}
