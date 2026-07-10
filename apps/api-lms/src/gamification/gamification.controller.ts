import type { AuthenticatedUser, GamificationSummaryDto, PointsHistoryEntryDto } from "@cerios/shared-types";
import { Controller, Get, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

import { GamificationService } from "./gamification.service";

@UseGuards(JwtAuthGuard)
@Controller("gamification")
export class GamificationController {
    constructor(private readonly gamificationService: GamificationService) { }

    @Get("me")
    getSummary(@CurrentUser() user: AuthenticatedUser): Promise<GamificationSummaryDto> {
        return this.gamificationService.getSummary(user.id);
    }

    @Get("me/history")
    getHistory(@CurrentUser() user: AuthenticatedUser): Promise<PointsHistoryEntryDto[]> {
        return this.gamificationService.getHistory(user.id);
    }
}
