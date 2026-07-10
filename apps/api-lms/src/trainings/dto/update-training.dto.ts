import type { UpdateTrainingRequest } from "@cerios/shared-types";
import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateTrainingDto implements UpdateTrainingRequest {
	@IsOptional()
	@IsString()
	@MinLength(1)
	title?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsString()
	level?: string;

	@IsOptional()
	@IsString()
	language?: string;

	@IsOptional()
	@IsBoolean()
	gamificationEnabled?: boolean;
}
