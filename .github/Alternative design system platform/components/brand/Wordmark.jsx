import React from "react";

/**
 * Cerios wordmark. NOTE: the real Cerios brand mark (interlocking looped star) is
 * NOT reproduced — we were not given the logo asset. This renders the "cerios"
 * wordmark in plain type. Swap in the official SVG when available.
 */
export function Wordmark({ onDark = false, size = 34, tagline = true, style = {} }) {
	const color = onDark ? "#ffffff" : "var(--ce-navy-700)";
	return (
		<span style={{ display: "inline-flex", alignItems: "center", gap: 14, ...style }}>
			<span
				style={{
					fontFamily: "var(--font-sans)",
					fontWeight: 700,
					fontSize: size,
					letterSpacing: "-0.03em",
					color,
					lineHeight: 1,
				}}
			>
				cerios
			</span>
			{tagline && (
				<span
					style={{
						fontFamily: "var(--font-sans)",
						fontWeight: 500,
						fontSize: size * 0.32,
						lineHeight: 1.15,
						color,
						opacity: 0.85,
						borderLeft: `1.5px solid ${onDark ? "rgba(255,255,255,0.25)" : "var(--ce-divider-on-light)"}`,
						paddingLeft: 12,
					}}
				>
					about
					<br />
					software
					<br />
					quality
				</span>
			)}
		</span>
	);
}
