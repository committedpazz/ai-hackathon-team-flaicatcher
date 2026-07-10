import type { AuthenticatedUser } from "@cerios/shared-types";
import { BadRequestException, Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

const ACCESS_TOKEN_COOKIE = "access_token";
const ACCESS_TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000;

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post("login")
    @HttpCode(200)
    login(
        @Req() request: Request & { user: AuthenticatedUser },
        @Res({ passthrough: true }) response: Response
    ): AuthenticatedUser {
        const user = request.user;
        const accessToken = this.authService.signAccessToken(user);

        response.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: ACCESS_TOKEN_MAX_AGE_MS,
        });

        return user;
    }

    @Post("logout")
    @HttpCode(200)
    logout(@Res({ passthrough: true }) response: Response): { success: true } {
        response.clearCookie(ACCESS_TOKEN_COOKIE);
        return { success: true };
    }

    @UseGuards(JwtAuthGuard)
    @Get("me")
    me(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
        return user;
    }

    @Post("forgot-password")
    @HttpCode(200)
    async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{ success: true }> {
        await this.authService.forgotPassword(dto.username);
        return { success: true };
    }

    @Post("reset-password")
    @HttpCode(200)
    async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ success: true }> {
        const didReset = await this.authService.resetPassword(dto.token, dto.newPassword);
        if (!didReset) {
            throw new BadRequestException("Reset link is invalid or has expired.");
        }
        return { success: true };
    }
}
