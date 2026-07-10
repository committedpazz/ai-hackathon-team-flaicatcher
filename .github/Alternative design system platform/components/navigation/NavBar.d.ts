import React from "react";

export interface NavBarProps {
	onMenu?: () => void;
	/** Toggles the hamburger→close animation. @default false */
	menuOpen?: boolean;
	style?: React.CSSProperties;
}

/**
 * The Cerios top navigation bar.
 * @startingPoint section="Navigation" subtitle="White top bar + wordmark + hamburger" viewport="700x80"
 */
export function NavBar(props: NavBarProps): JSX.Element;
