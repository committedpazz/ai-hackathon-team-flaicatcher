import type { LearningPathDetailDto } from "@cerios/shared-types";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { apiClient } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { AppHeader, Badge } from "../design-system";

export function LearningPathDetailPage(): React.JSX.Element {
	const { user, logout } = useAuth();
	const { learningPathId } = useParams<{ learningPathId: string }>();
	const [path, setPath] = useState<LearningPathDetailDto | null>(null);

	useEffect(() => {
		if (!learningPathId) {
			return;
		}
		apiClient
			.get<LearningPathDetailDto>(`/learning-paths/${learningPathId}`)
			.then(setPath)
			.catch(() => setPath(null));
	}, [learningPathId]);

	if (!user || !path) {
		return <p>Loading...</p>;
	}

	return (
		<main>
			<AppHeader user={user} onLogout={() => void logout()} />
			<div style={{ padding: "0 24px" }}>
				<Link className="back-link" to="/learning-paths">
					← Learning paths
				</Link>
				<h1>{path.title}</h1>
				{path.completed && <Badge tone="green-dark">Leerpad afgerond</Badge>}
				<p>{path.description}</p>
				<div className="progress-row">
					<progress value={path.progressPercentage} max={100} />
					<span>{path.progressPercentage}%</span>
				</div>
				<ul className="trainings-list">
					{path.trainings
						.slice()
						.sort((a, b) => a.order - b.order)
						.map(training => (
							<li className="training-card" key={training.trainingId}>
								<Link to={`/trainings/${training.trainingId}`}>{training.title}</Link>
								{training.completed && (
									<Badge tone="green-dark" style={{ fontSize: 11, marginLeft: 8 }}>
										Afgerond
									</Badge>
								)}
								<div className="progress-row">
									<progress value={training.progressPercentage} max={100} />
									<span>{training.progressPercentage}%</span>
								</div>
							</li>
						))}
				</ul>
			</div>
		</main>
	);
}
