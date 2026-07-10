import type { GamificationAwardResultDto } from "@cerios/shared-types";
import { useEffect } from "react";

import { Button } from "../design-system";

interface GamificationToastProps {
	result: GamificationAwardResultDto | null;
	onDismiss: () => void;
}

/**
 * Static, non-blocking points/milestone/badge notification (spec 5.5.4 / 5.5.11).
 * No animation is used, so it already respects prefers-reduced-motion and never
 * interrupts the training. It auto-dismisses, but can also be closed manually,
 * and is announced to screen readers via aria-live.
 */
export function GamificationToast({ result, onDismiss }: GamificationToastProps): React.JSX.Element | null {
	const totalAwarded = result?.awards.reduce((sum, award) => sum + award.points, 0) ?? 0;
	const hasContent = Boolean(
		result && (totalAwarded > 0 || result.milestonesReached.length > 0 || result.badgesAwarded.length > 0)
	);

	useEffect(() => {
		if (!hasContent) {
			return;
		}
		const timer = setTimeout(onDismiss, 8000);
		return () => clearTimeout(timer);
	}, [hasContent, onDismiss]);

	if (!result || !hasContent) {
		return null;
	}

	return (
		<div
			role="status"
			aria-live="polite"
			style={{
				position: "fixed",
				bottom: 24,
				right: 24,
				maxWidth: 360,
				background: "#fff",
				border: "1px solid var(--ce-divider-on-light)",
				borderRadius: 16,
				boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
				padding: 16,
				zIndex: 1000,
			}}
		>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
				<div>
					{totalAwarded > 0 && <p style={{ margin: 0, fontWeight: 700 }}>+{totalAwarded} punten!</p>}
					{result.awards.map(award => (
						<p key={award.ruleCode} style={{ margin: "4px 0 0", fontSize: 13 }}>
							+{award.points} voor {award.reason}
						</p>
					))}
					{result.milestonesReached.map(milestone => (
						<div key={milestone.code} style={{ marginTop: 8 }}>
							<p style={{ margin: 0, fontWeight: 600 }}>{milestone.message}</p>
							{milestone.reasonMessage && <p style={{ margin: "2px 0 0", fontSize: 13 }}>{milestone.reasonMessage}</p>}
						</div>
					))}
					{result.badgesAwarded.map(badge => (
						<p key={badge.id} style={{ margin: "4px 0 0", fontSize: 13 }}>
							🏅 Nieuwe badge: {badge.name}
						</p>
					))}
				</div>
				<Button variant="cream" size="sm" arrow={false} onClick={onDismiss} aria-label="Melding sluiten">
					✕
				</Button>
			</div>
		</div>
	);
}
