import React from "react";

import { Wordmark } from "../brand/Wordmark.jsx";

/** Cerios top navigation — white bar, wordmark, and a hamburger with a green status dot. */
export function NavBar({ onMenu, menuOpen = false, style = {} }) {
	return (
		<header
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "18px 24px",
				background: "#fff",
				borderBottom: "1px solid var(--ce-divider-on-light)",
				...style,
			}}
		>
			<Wordmark size={30} />
			<button
				aria-label="Menu"
				onClick={onMenu}
				style={{
					position: "relative",
					width: 44,
					height: 44,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: 6,
					background: "transparent",
					border: "none",
					cursor: "pointer",
				}}
			>
				<span
					style={{
						width: 26,
						height: 2.5,
						borderRadius: 2,
						background: "var(--ce-navy-700)",
						transition: "transform 150ms ease",
						transform: menuOpen ? "translateY(4.25px) rotate(12deg)" : "none",
					}}
				/>
				<span
					style={{
						width: 26,
						height: 2.5,
						borderRadius: 2,
						background: "var(--ce-navy-700)",
						transition: "transform 150ms ease",
						transform: menuOpen ? "translateY(-4.25px) rotate(-12deg)" : "none",
					}}
				/>
				<span
					style={{
						position: "absolute",
						top: 6,
						right: 4,
						width: 9,
						height: 9,
						borderRadius: "50%",
						background: "var(--ce-green-400)",
					}}
				/>
			</button>
		</header>
	);
}
