import React from "react";

export interface AccordionItem {
	label: string;
	children?: { label: string; href?: string }[];
}

export interface AccordionProps {
	items: AccordionItem[];
	/** Style for the dark menu overlay. @default true */
	onDark?: boolean;
	style?: React.CSSProperties;
}

/** Large-label menu accordion with "+" expanders (rotates to × when open). */
export function Accordion(props: AccordionProps): JSX.Element;
