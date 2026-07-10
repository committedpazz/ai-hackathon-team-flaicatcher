import type { AuthoredLearningPathSummaryDto, CreateLearningPathRequest } from "@cerios/shared-types";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiClient } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { AppHeader, Badge, Button, Input } from "../design-system";

export function LearningPathAuthoringListPage(): React.JSX.Element {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [paths, setPaths] = useState<AuthoredLearningPathSummaryDto[] | null>(null);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		apiClient
			.get<AuthoredLearningPathSummaryDto[]>("/authoring/learning-paths")
			.then(setPaths)
			.catch(() => setPaths([]));
	}, []);

	const handleCreate = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		setIsSubmitting(true);
		try {
			const request: CreateLearningPathRequest = { title, description };
			const created = await apiClient.post<AuthoredLearningPathSummaryDto>("/authoring/learning-paths", request);
			void navigate(`/authoring/learning-paths/${created.id}`);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main>
			{user && <AppHeader user={user} onLogout={() => void logout()} />}
			<div style={{ padding: "0 24px" }}>
				<h1>My authored learning paths</h1>

				{!paths && <p>Loading...</p>}
				{paths && paths.length === 0 && <p>You haven&apos;t created any learning paths yet.</p>}
				<ul className="trainings-list" style={{ padding: 0, margin: "0 0 32px" }}>
					{paths?.map(path => (
						<li className="training-card" key={path.id}>
							<Link to={`/authoring/learning-paths/${path.id}`}>{path.title}</Link>
							<p>{path.description}</p>
							<div className="progress-row">
								<Badge tone={path.status === "PUBLISHED" ? "green-dark" : "ink"} style={{ fontSize: 11 }}>
									{path.status === "PUBLISHED" ? "Published" : "Draft"}
								</Badge>
								<span>{path.trainingCount} trainingen</span>
							</div>
						</li>
					))}
				</ul>

				<h2>Create a new learning path</h2>
				<form className="form card" style={{ maxWidth: 400 }} onSubmit={event => void handleCreate(event)}>
					<Input label="Title" value={title} onChange={event => setTitle(event.target.value)} required />
					<Input
						label="Description"
						value={description}
						onChange={event => setDescription(event.target.value)}
						required
					/>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Creating..." : "Create learning path"}
					</Button>
				</form>
			</div>
		</main>
	);
}
