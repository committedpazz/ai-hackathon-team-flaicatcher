import type { LoginRequest } from "@cerios/shared-types";
import { IsString, MinLength } from "class-validator";

export class LoginDto implements LoginRequest {
	@IsString()
	username!: string;

	@IsString()
	@MinLength(8)
	password!: string;
}
