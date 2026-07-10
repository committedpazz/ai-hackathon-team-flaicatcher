import type { CreateQuizRequest, QuizOptionInput, QuizQuestionInput } from "@cerios/shared-types";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsInt, IsString, Min, MinLength, ValidateNested } from "class-validator";

export class QuizOptionInputDto implements QuizOptionInput {
    @IsString()
    @MinLength(1)
    text!: string;

    @IsBoolean()
    isCorrect!: boolean;

    @IsInt()
    @Min(1)
    order!: number;
}

export class QuizQuestionInputDto implements QuizQuestionInput {
    @IsString()
    @MinLength(1)
    text!: string;

    @IsInt()
    @Min(1)
    order!: number;

    @IsArray()
    @ArrayMinSize(2)
    @ValidateNested({ each: true })
    @Type(() => QuizOptionInputDto)
    options!: QuizOptionInputDto[];
}

export class CreateQuizDto implements CreateQuizRequest {
    @IsString()
    @MinLength(1)
    title!: string;

    @IsInt()
    @Min(0)
    passingScorePercentage!: number;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => QuizQuestionInputDto)
    questions!: QuizQuestionInputDto[];
}
