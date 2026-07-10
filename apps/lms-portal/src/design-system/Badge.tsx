import type { CSSProperties, ReactNode } from "react";

type BadgeTone = "green" | "green-dark" | "ink";

interface BadgeProps {
	children: ReactNode;
	tone?: BadgeTone;
	style?: CSSProperties;
}

const TONES: Record<BadgeTone, CSSProperties> = {
	green: { color: "var(--ce-green-500)" },
	"green-dark": { color: "var(--ce-navy-800)", background: "var(--ce-green-400)" },
	ink: { color: "var(--ce-gray-600)" },
};

/** Small status/category label used above headings or next to titles. */
export function Badge({ children, tone = "green", style }: BadgeProps): React.JSX.Element {
	const toneStyle = TONES[tone];
	const isPill = tone === "green-dark";

	return (
		<span
			style={{
				fontFamily: "var(--font-sans)",
				fontSize: 13,
				fontWeight: 600,
				lineHeight: 1.3,
				...(isPill ? { padding: "4px 12px", borderRadius: "var(--radius-pill)", display: "inline-block" } : {}),
				...toneStyle,
				...style,
			}}
		>
			{children}
		</span>
	);
}
