import type { LearningPathSummaryDto } from "@cerios/shared-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiClient } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { AppHeader, Badge } from "../design-system";

export function LearningPathsListPage(): React.JSX.Element {
	const { user, logout } = useAuth();
	const [paths, setPaths] = useState<LearningPathSummaryDto[] | null>(null);

	useEffect(() => {
		apiClient
			.get<LearningPathSummaryDto[]>("/learning-paths")
			.then(setPaths)
			.catch(() => setPaths([]));
	}, []);

	if (!user) {
		return <p>Loading...</p>;
	}

	return (
		<main>
			<AppHeader user={user} onLogout={() => void logout()} />
			<h1 style={{ padding: "0 24px" }}>Learning paths</h1>
			{!paths && <p style={{ padding: "0 24px" }}>Loading...</p>}
			{paths && paths.length === 0 && <p style={{ padding: "0 24px" }}>No learning paths available yet.</p>}
			<ul className="trainings-list">
				{paths?.map(path => (
					<li className="training-card" key={path.id}>
						<Link to={`/learning-paths/${path.id}`}>{path.title}</Link>
						{path.completed && (
							<Badge tone="green-dark" style={{ fontSize: 11, marginLeft: 8 }}>
								Afgerond
							</Badge>
						)}
						<p>{path.description}</p>
						<div className="progress-row">
							<progress value={path.progressPercentage} max={100} />
							<span>{path.progressPercentage}%</span>
						</div>
						<p style={{ fontSize: 13, color: "var(--ce-gray-400)" }}>{path.trainingCount} trainingen</p>
					</li>
				))}
			</ul>
		</main>
	);
}
