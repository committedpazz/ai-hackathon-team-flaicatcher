import type { Role } from "./role.js";

export interface LoginRequest {
	username: string;
	password: string;
}

export interface AuthenticatedUser {
	id: string;
	username: string;
	roles: Role[];
}

export interface ForgotPasswordRequest {
	username: string;
}

export interface ResetPasswordRequest {
	token: string;
	newPassword: string;
}
