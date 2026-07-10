import type { CSSProperties, ReactNode } from "react";

interface CardProps {
	children: ReactNode;
	style?: CSSProperties;
}

/** Flat Cerios card: white, 20px radius, generous padding, no shadow. */
export function Card({ children, style }: CardProps): React.JSX.Element {
	return (
		<div
			style={{
				background: "var(--surface-card)",
				borderRadius: "var(--radius-card)",
				padding: "var(--card-pad)",
				...style,
			}}
		>
			{children}
		</div>
	);
}
