import type { AuthenticatedUser } from "@cerios/shared-types";
import { NavLink } from "react-router-dom";

import { Button } from "./Button";

interface AppHeaderProps {
	user: AuthenticatedUser;
	onLogout: () => void;
}

const tabStyle = (isActive: boolean): React.CSSProperties => ({
	fontFamily: "var(--font-sans)",
	fontSize: 15,
	fontWeight: 600,
	textDecoration: "none",
	padding: "8px 4px",
	color: isActive ? "var(--ce-navy-700)" : "var(--ce-gray-400)",
	borderBottom: isActive ? "2px solid var(--ce-green-400)" : "2px solid transparent",
});

/** App-wide header: wordmark, role-aware nav tabs, and the current user + logout. */
export function AppHeader({ user, onLogout }: AppHeaderProps): React.JSX.Element {
	const isTrainer = user.roles.includes("TRAINER");

	return (
		<header
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 4,
				background: "#fff",
				borderBottom: "1px solid var(--ce-divider-on-light)",
				padding: "18px 24px 0",
				marginBottom: 32,
			}}
		>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
					<span
						style={{
							fontFamily: "var(--font-sans)",
							fontWeight: 700,
							fontSize: 22,
							letterSpacing: "-0.02em",
							color: "var(--ce-navy-700)",
						}}
					>
						cerios
					</span>
					<span
						style={{
							fontFamily: "var(--font-sans)",
							fontWeight: 500,
							fontSize: 13,
							color: "var(--ce-gray-400)",
							borderLeft: "1.5px solid var(--ce-divider-on-light)",
							paddingLeft: 10,
						}}
					>
						academy
					</span>
				</span>
				<span style={{ display: "flex", alignItems: "center", gap: 16 }}>
					<span style={{ fontSize: 14, color: "var(--ce-gray-600)" }}>{user.username}</span>
					<Button variant="cream" size="sm" arrow={false} onClick={onLogout}>
						Log out
					</Button>
				</span>
			</div>
			<nav style={{ display: "flex", gap: 24 }}>
				<NavLink to="/trainings" style={({ isActive }) => tabStyle(isActive)}>
					My trainings
				</NavLink>
				{isTrainer && (
					<NavLink to="/authoring" style={({ isActive }) => tabStyle(isActive)}>
						My authored trainings
					</NavLink>
				)}
			</nav>
		</header>
	);
}
