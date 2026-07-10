import React from "react";

export interface BadgeProps {
	children: React.ReactNode;
	/** @default "green" */
	tone?: "green" | "green-dark" | "ink";
	style?: React.CSSProperties;
}

/** Green eyebrow / category label shown above section headings. */
export function Badge(props: BadgeProps): JSX.Element;
