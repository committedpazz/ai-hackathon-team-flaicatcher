import React from "react";

export interface CardProps {
	/** Icon glyph shown inside the green tile (e.g. an SVG). */
	icon?: React.ReactNode;
	title: React.ReactNode;
	body: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * Feature card with green icon tile.
 * @startingPoint section="Core" subtitle="White rounded card + green icon tile" viewport="360x320"
 */
export function Card(props: CardProps): JSX.Element;
