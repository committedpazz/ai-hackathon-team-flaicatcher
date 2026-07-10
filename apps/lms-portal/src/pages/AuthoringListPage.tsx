import type { AuthoredTrainingSummaryDto, CreateTrainingRequest } from "@cerios/shared-types";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiClient } from "../api/client";

export function AuthoringListPage(): React.JSX.Element {
	const navigate = useNavigate();
	const [trainings, setTrainings] = useState<AuthoredTrainingSummaryDto[] | null>(null);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [level, setLevel] = useState("Junior");
	const [language, setLanguage] = useState("nl");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		apiClient
			.get<AuthoredTrainingSummaryDto[]>("/authoring/trainings")
			.then(setTrainings)
			.catch(() => setTrainings([]));
	}, []);

	const handleCreate = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		setIsSubmitting(true);
		try {
			const request: CreateTrainingRequest = { title, description, level, language };
			const created = await apiClient.post<AuthoredTrainingSummaryDto>("/authoring/trainings", request);
			void navigate(`/authoring/${created.id}`);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main>
			<header className="page-header">
				<h1>My authored trainings</h1>
				<Link className="muted-link" to="/trainings">
					My trainings
				</Link>
			</header>

			{!trainings && <p>Loading...</p>}
			{trainings && trainings.length === 0 && <p>You haven&apos;t created any trainings yet.</p>}
			<ul className="trainings-list">
				{trainings?.map(training => (
					<li className="training-card" key={training.id}>
						<Link to={`/authoring/${training.id}`}>{training.title}</Link>
						<p>{training.description}</p>
						<div className="progress-row">
							<span>{training.status}</span>
							<span>
								{training.chapterCount} chapters, {training.lessonCount} lessons
							</span>
						</div>
					</li>
				))}
			</ul>

			<h2>Create a new training</h2>
			<form className="form card" onSubmit={event => void handleCreate(event)}>
				<label>
					Title
					<input value={title} onChange={event => setTitle(event.target.value)} required />
				</label>
				<label>
					Description
					<input value={description} onChange={event => setDescription(event.target.value)} required />
				</label>
				<label>
					Level
					<input value={level} onChange={event => setLevel(event.target.value)} required />
				</label>
				<label>
					Language
					<input value={language} onChange={event => setLanguage(event.target.value)} required />
				</label>
				<button className="button" type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Creating..." : "Create training"}
				</button>
			</form>
		</main>
	);
}
