import type { CreateTrainingRequest } from "@cerios/shared-types";
import { IsString, MinLength } from "class-validator";

export class CreateTrainingDto implements CreateTrainingRequest {
    @IsString()
    @MinLength(1)
    title!: string;

    @IsString()
    description!: string;

    @IsString()
    level!: string;

    @IsString()
    language!: string;
}
