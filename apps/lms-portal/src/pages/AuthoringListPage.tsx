import type { AuthoredTrainingSummaryDto, CreateTrainingRequest } from "@cerios/shared-types";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiClient } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { AppHeader, Badge, Button, Input } from "../design-system";

export function AuthoringListPage(): React.JSX.Element {
	const { user, logout } = useAuth();
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
			{user && <AppHeader user={user} onLogout={() => void logout()} />}
			<div style={{ padding: "0 24px" }}>
				<h1>My authored trainings</h1>

				{!trainings && <p>Loading...</p>}
				{trainings && trainings.length === 0 && <p>You haven&apos;t created any trainings yet.</p>}
				<ul className="trainings-list" style={{ padding: 0, margin: "0 0 32px" }}>
					{trainings?.map(training => (
						<li className="training-card" key={training.id}>
							<Link to={`/authoring/${training.id}`}>{training.title}</Link>
							<p>{training.description}</p>
							<div className="progress-row">
								<Badge tone={training.status === "PUBLISHED" ? "green-dark" : "ink"} style={{ fontSize: 11 }}>
									{training.status === "PUBLISHED" ? "Published" : "Draft"}
								</Badge>
								<span>
									{training.chapterCount} chapters, {training.lessonCount} lessons
								</span>
							</div>
						</li>
					))}
				</ul>

				<h2>Create a new training</h2>
				<form
					className="form card"
					style={{ margin: "0 0 0", maxWidth: 400 }}
					onSubmit={event => void handleCreate(event)}
				>
					<Input label="Title" value={title} onChange={event => setTitle(event.target.value)} required />
					<Input
						label="Description"
						value={description}
						onChange={event => setDescription(event.target.value)}
						required
					/>
					<Input label="Level" value={level} onChange={event => setLevel(event.target.value)} required />
					<Input label="Language" value={language} onChange={event => setLanguage(event.target.value)} required />
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Creating..." : "Create training"}
					</Button>
				</form>
			</div>
		</main>
	);
}
