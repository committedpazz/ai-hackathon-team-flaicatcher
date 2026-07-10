import { LessonContentType } from "@cerios/shared-types";
import type { UpdateLessonRequest } from "@cerios/shared-types";
import { IsIn, IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class UpdateLessonDto implements UpdateLessonRequest {
	@IsOptional()
	@IsString()
	@MinLength(1)
	title?: string;

	@IsOptional()
	@IsInt()
	@Min(1)
	order?: number;

	@IsOptional()
	@IsIn(Object.values(LessonContentType))
	contentType?: LessonContentType;

	@IsOptional()
	@IsString()
	contentBody?: string;
}
