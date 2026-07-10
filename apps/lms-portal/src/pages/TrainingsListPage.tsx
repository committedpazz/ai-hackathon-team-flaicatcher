import type { TrainingSummaryDto } from "@cerios/shared-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiClient } from "../api/client";
import { useAuth } from "../auth/useAuth";

export function TrainingsListPage(): React.JSX.Element {
	const { user, logout } = useAuth();
	const [trainings, setTrainings] = useState<TrainingSummaryDto[] | null>(null);

	useEffect(() => {
		apiClient
			.get<TrainingSummaryDto[]>("/trainings")
			.then(setTrainings)
			.catch(() => setTrainings([]));
	}, []);

	return (
		<main>
			<header className="page-header">
				<h1>My trainings</h1>
				<div className="user-info">
					<span>Logged in as {user?.username}</span>
					<button className="button button-secondary" type="button" onClick={() => void logout()}>
						Log out
					</button>
				</div>
			</header>
			{!trainings && <p>Loading...</p>}
			{trainings && trainings.length === 0 && <p>No trainings available yet.</p>}
			<ul className="trainings-list">
				{trainings?.map(training => (
					<li className="training-card" key={training.id}>
						<Link to={`/trainings/${training.id}`}>{training.title}</Link>
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
