import type { GamificationSummaryDto } from "@cerios/shared-types";
import { useEffect, useState } from "react";

import { apiClient } from "../api/client";
import { Badge, Card } from "../design-system";

/**
 * Learner dashboard summary widget (spec 5.5.8): current points, level,
 * progress to next level, last earned points, recent badges, next milestone
 * and an explanation of how to earn more points.
 */
export function GamificationWidget(): React.JSX.Element | null {
	const [summary, setSummary] = useState<GamificationSummaryDto | null>(null);

	useEffect(() => {
		apiClient
			.get<GamificationSummaryDto>("/gamification/me")
			.then(setSummary)
			.catch(() => setSummary(null));
	}, []);

	if (!summary) {
		return null;
	}

	return (
		<Card style={{ marginBottom: 24 }}>
			<div
				style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}
			>
				<div>
					<p style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
						{summary.totalPoints} punten — Level {summary.level}: {summary.levelName}
					</p>
					{summary.nextLevelName && (
						<p style={{ margin: "4px 0 0", color: "var(--ce-gray-400)" }}>
							Nog {summary.pointsToNextLevel} punten tot Level {summary.level + 1}: {summary.nextLevelName}
						</p>
					)}
					{summary.lastAward && (
						<p style={{ margin: "4px 0 0" }}>
							Laatst verdiend: +{summary.lastAward.points} punten voor {summary.lastAward.reason}
						</p>
					)}
				</div>
				<div style={{ minWidth: 220 }}>
					<progress value={summary.levelProgressPercentage} max={100} style={{ width: "100%" }} />
					{summary.nextMilestone && (
						<p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ce-gray-400)" }}>
							Nog {summary.nextMilestone.pointsRemaining} punten tot mijlpaal &quot;{summary.nextMilestone.label}&quot;
						</p>
					)}
					{summary.currentStreakWeeks > 0 && (
						<p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ce-gray-400)" }}>
							🔥 {summary.currentStreakWeeks} actieve {summary.currentStreakWeeks === 1 ? "week" : "weken"} op rij
						</p>
					)}
				</div>
			</div>

			{summary.recentBadges.length > 0 && (
				<div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
					{summary.recentBadges.map(badge => (
						<Badge key={badge.id} tone="green-dark" style={{ fontSize: 11 }}>
							🏅 {badge.name}
						</Badge>
					))}
				</div>
			)}

			<details style={{ marginTop: 12 }}>
				<summary style={{ cursor: "pointer", fontSize: 13, color: "var(--ce-gray-400)" }}>
					Hoe verdien ik punten?
				</summary>
				<ul style={{ margin: "8px 0 0", paddingLeft: 20, fontSize: 13 }}>
					{summary.howToEarnPoints.map(rule => (
						<li key={rule.code}>
							{rule.description}: +{rule.points} punten
						</li>
					))}
				</ul>
			</details>
		</Card>
	);
}
