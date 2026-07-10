import type { SubmitQuizAnswer, SubmitQuizAttemptRequest } from "@cerios/shared-types";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsString, ValidateNested } from "class-validator";

export class SubmitQuizAnswerDto implements SubmitQuizAnswer {
    @IsString()
    questionId!: string;

    @IsString()
    optionId!: string;
}

export class SubmitQuizAttemptDto implements SubmitQuizAttemptRequest {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => SubmitQuizAnswerDto)
    answers!: SubmitQuizAnswerDto[];
}
