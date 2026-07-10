import type { CreateChapterRequest } from "@cerios/shared-types";
import { IsInt, IsString, Min, MinLength } from "class-validator";

export class CreateChapterDto implements CreateChapterRequest {
	@IsString()
	@MinLength(1)
	title!: string;

	@IsInt()
	@Min(1)
	order!: number;
}
