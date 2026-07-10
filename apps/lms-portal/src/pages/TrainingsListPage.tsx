import type { TrainingSummaryDto } from "@cerios/shared-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiClient } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { AppHeader, Badge } from "../design-system";
import { GamificationWidget } from "../gamification/GamificationWidget";

export function TrainingsListPage(): React.JSX.Element {
	const { user, logout } = useAuth();
	const [trainings, setTrainings] = useState<TrainingSummaryDto[] | null>(null);

	useEffect(() => {
		apiClient
			.get<TrainingSummaryDto[]>("/trainings")
			.then(setTrainings)
			.catch(() => setTrainings([]));
	}, []);

	if (!user) {
		return <p>Loading...</p>;
	}

	return (
		<main>
			<AppHeader user={user} onLogout={() => void logout()} />
			<div style={{ padding: "0 24px" }}>
				<GamificationWidget />
			</div>
			<h1 style={{ padding: "0 24px" }}>My trainings</h1>
			{!trainings && <p style={{ padding: "0 24px" }}>Loading...</p>}
			{trainings && trainings.length === 0 && <p style={{ padding: "0 24px" }}>No trainings available yet.</p>}
			<ul className="trainings-list">
				{trainings?.map(training => (
					<li className="training-card" key={training.id}>
						<Link to={`/trainings/${training.id}`}>{training.title}</Link>
						{training.hasQuiz && (
							<Badge tone="ink" style={{ fontSize: 11, marginLeft: 8 }}>
								Incl. toets
							</Badge>
						)}
						<p>{training.description}</p>
						<div className="progress-row">
							<progress value={training.progressPercentage} max={100} />
							<span>{training.progressPercentage}%</span>
						</div>
					</li>
				))}
			</ul>
		</main>
	);
}
