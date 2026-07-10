import type { UpdateLearningPathRequest } from "@cerios/shared-types";
import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateLearningPathDto implements UpdateLearningPathRequest {
    @IsOptional()
    @IsString()
    @MinLength(1)
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
