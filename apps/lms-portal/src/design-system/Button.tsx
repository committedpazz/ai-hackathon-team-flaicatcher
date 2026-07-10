import type { ButtonHTMLAttributes } from "react";
import { useState } from "react";

type ButtonVariant = "primary" | "cream" | "navy" | "outline-on-dark";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	arrow?: boolean;
	type?: "button" | "submit" | "reset";
}

const SIZES: Record<ButtonSize, { padding: string; fontSize: number; gap: number }> = {
	sm: { padding: "8px 16px", fontSize: 14, gap: 6 },
	md: { padding: "12px 22px", fontSize: 16, gap: 8 },
	lg: { padding: "16px 30px", fontSize: 18, gap: 10 },
};

const VARIANTS: Record<ButtonVariant, { background: string; color: string; border: string }> = {
	primary: { background: "var(--ce-green-400)", color: "var(--ce-navy-800)", border: "1px solid transparent" },
	cream: { background: "var(--ce-cream)", color: "var(--ce-navy-700)", border: "1px solid transparent" },
	navy: { background: "var(--ce-navy-900)", color: "#fff", border: "1px solid transparent" },
	"outline-on-dark": { background: "transparent", color: "#fff", border: "1px solid var(--ce-divider-on-dark)" },
};

/** Cerios pill button. Every button is a full pill with an optional leading arrow. */
export function Button({
	children,
	variant = "primary",
	size = "md",
	arrow = true,
	type = "button",
	disabled = false,
	style,
	...rest
}: ButtonProps): React.JSX.Element {
	const [hover, setHover] = useState(false);
	const s = SIZES[size];
	const v = VARIANTS[variant];
	const hoverStyle =
		hover && !disabled
			? variant === "primary"
				? { background: "var(--ce-green-500)" }
				: { filter: "brightness(0.96)" }
			: {};

	return (
		<button
			type={type}
			disabled={disabled}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			style={{
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				gap: s.gap,
				padding: s.padding,
				fontFamily: "var(--font-sans)",
				fontSize: s.fontSize,
				fontWeight: 600,
				lineHeight: 1,
				borderRadius: "var(--radius-pill)",
				cursor: disabled ? "not-allowed" : "pointer",
				opacity: disabled ? 0.5 : 1,
				whiteSpace: "nowrap",
				transition: "filter 150ms ease, background 150ms ease",
				...v,
				...hoverStyle,
				...style,
			}}
			{...rest}
		>
			{arrow && (
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
					<path
						d="M4 12h15M13 6l6 6-6 6"
						stroke="currentColor"
						strokeWidth="2.2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			)}
			<span>{children}</span>
		</button>
	);
}
