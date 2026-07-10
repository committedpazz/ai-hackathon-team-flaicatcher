import type { ForgotPasswordRequest } from "@cerios/shared-types";
import { IsString } from "class-validator";

export class ForgotPasswordDto implements ForgotPasswordRequest {
    @IsString()
    username!: string;
}
