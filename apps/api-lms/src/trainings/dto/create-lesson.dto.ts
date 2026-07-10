import { LessonContentType } from "@cerios/shared-types";
import type { CreateLessonRequest } from "@cerios/shared-types";
import { IsIn, IsInt, IsString, Min, MinLength } from "class-validator";

export class CreateLessonDto implements CreateLessonRequest {
	@IsString()
	@MinLength(1)
	title!: string;

	@IsInt()
	@Min(1)
	order!: number;

	@IsIn(Object.values(LessonContentType))
	contentType!: LessonContentType;

	@IsString()
	contentBody!: string;
}
