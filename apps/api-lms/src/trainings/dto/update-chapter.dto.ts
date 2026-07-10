import type { UpdateChapterRequest } from "@cerios/shared-types";
import { IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class UpdateChapterDto implements UpdateChapterRequest {
    @IsOptional()
    @IsString()
    @MinLength(1)
    title?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    order?: number;
}
