import type { AuthenticatedUser } from "@cerios/shared-types";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { Strategy } from "passport-jwt";

import type { JwtPayload } from "../types/jwt-payload";

function extractJwtFromCookie(request: Request): string | null {
	const token: unknown = request.cookies?.access_token;
	return typeof token === "string" ? token : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: extractJwtFromCookie,
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET ?? "dev-secret-change-me",
		});
	}

	validate(payload: JwtPayload): AuthenticatedUser {
		return { id: payload.sub, username: payload.username, roles: payload.roles };
	}
}
