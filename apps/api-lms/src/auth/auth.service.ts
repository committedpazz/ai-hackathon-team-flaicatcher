import { randomBytes } from "node:crypto";

import { prisma } from "@cerios/database";
import type { AuthenticatedUser } from "@cerios/shared-types";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcryptjs";

import type { JwtPayload } from "./types/jwt-payload";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }

    async validateUser(username: string, password: string): Promise<AuthenticatedUser | null> {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user || user.deactivatedAt) {
            return null;
        }

        const passwordMatches = await compare(password, user.passwordHash);
        if (!passwordMatches) {
            return null;
        }

        return { id: user.id, username: user.username, roles: user.roles };
    }

    signAccessToken(user: AuthenticatedUser): string {
        const payload: JwtPayload = { sub: user.id, username: user.username, roles: user.roles };
        return this.jwtService.sign(payload);
    }

    async forgotPassword(username: string): Promise<void> {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            // Do not reveal whether the username exists.
            return;
        }

        const token = randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

        await prisma.passwordResetToken.create({
            data: { userId: user.id, token, expiresAt },
        });

        // Hackathon shortcut: no email provider is configured yet, so the reset
        // link is logged instead of sent. Swap this for real email delivery later.
        const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";
        console.log(`[auth] Password reset requested for "${username}": ${corsOrigin}/reset-password/${token}`);
    }

    async resetPassword(token: string, newPassword: string): Promise<boolean> {
        const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
        if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
            return false;
        }

        const passwordHash = await hash(newPassword, 10);

        await prisma.$transaction([
            prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
            prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
        ]);

        return true;
    }
}
