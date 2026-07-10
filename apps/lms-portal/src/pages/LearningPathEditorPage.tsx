import type {
	AuthoredLearningPathDetailDto,
	AuthoredTrainingSummaryDto,
	UpdateLearningPathRequest,
} from "@cerios/shared-types";
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import { apiClient } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { AppHeader, Badge, Button, Input } from "../design-system";

export function LearningPathEditorPage(): React.JSX.Element {
	const { user, logout } = useAuth();
	const { learningPathId } = useParams<{ learningPathId: string }>();
	const [path, setPath] = useState<AuthoredLearningPathDetailDto | null>(null);
	const [authoredTrainings, setAuthoredTrainings] = useState<AuthoredTrainingSummaryDto[]>([]);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [selectedTrainingId, setSelectedTrainingId] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);

	const reload = useCallback((): void => {
		if (!learningPathId) {
			return;
		}
		apiClient
			.get<AuthoredLearningPathDetailDto>(`/authoring/learning-paths/${learningPathId}`)
			.then(loaded => {
				setPath(loaded);
				setTitle(loaded.title);
				setDescription(loaded.description);
			})
			.catch(console.error);
	}, [learningPathId]);

	useEffect(() => {
		reload();
	}, [reload]);

	useEffect(() => {
		apiClient
			.get<AuthoredTrainingSummaryDto[]>("/authoring/trainings")
			.then(setAuthoredTrainings)
			.catch(() => setAuthoredTrainings([]));
	}, []);

	if (!path || !learningPathId) {
		return <p>Loading...</p>;
	}

	const availableTrainings = authoredTrainings.filter(
		training => !path.trainings.some(entry => entry.trainingId === training.id)
	);

	const handleSaveMetadata = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		setIsSaving(true);
		try {
			const request: UpdateLearningPathRequest = { title, description };
			await apiClient.patch(`/authoring/learning-paths/${learningPathId}`, request);
			reload();
		} finally {
			setIsSaving(false);
		}
	};

	const handlePublish = async (): Promise<void> => {
		setIsPublishing(true);
		try {
			await apiClient.post(`/authoring/learning-paths/${learningPathId}/publish`);
			reload();
		} finally {
			setIsPublishing(false);
		}
	};

	const handleAddTraining = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		if (!selectedTrainingId) {
			return;
		}
		await apiClient.post(`/authoring/learning-paths/${learningPathId}/trainings`, {
			trainingId: selectedTrainingId,
			order: path.trainings.length + 1,
		});
		setSelectedTrainingId("");
		reload();
	};

	const handleRemoveTraining = async (trainingId: string): Promise<void> => {
		await apiClient.delete(`/authoring/learning-paths/${learningPathId}/trainings/${trainingId}`);
		reload();
	};

	return (
		<main>
			{user && <AppHeader user={user} onLogout={() => void logout()} />}
			<div style={{ padding: "0 24px", maxWidth: 640 }}>
				<Link className="back-link" to="/authoring/learning-paths">
					← My authored learning paths
				</Link>
				<h1>{path.title}</h1>
				<Badge tone={path.status === "PUBLISHED" ? "green-dark" : "ink"} style={{ fontSize: 11 }}>
					{path.status === "PUBLISHED" ? "Published" : "Draft"}
				</Badge>

				<form className="form card" style={{ margin: "16px 0" }} onSubmit={event => void handleSaveMetadata(event)}>
					<Input label="Title" value={title} onChange={event => setTitle(event.target.value)} required />
					<Input
						label="Description"
						value={description}
						onChange={event => setDescription(event.target.value)}
						required
					/>
					<div className="progress-row">
						<Button type="submit" size="sm" disabled={isSaving}>
							{isSaving ? "Saving..." : "Save"}
						</Button>
						{path.status === "DRAFT" && (
							<Button variant="cream" size="sm" disabled={isPublishing} onClick={() => void handlePublish()}>
								{isPublishing ? "Publishing..." : "Publish"}
							</Button>
						)}
					</div>
				</form>

				<h3>Trainings in this path</h3>
				<ul className="lesson-list">
					{path.trainings.map(entry => (
						<li
							key={entry.trainingId}
							style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
						>
							<span>
								{entry.order}. {entry.title}
							</span>
							<Button
								variant="cream"
								size="sm"
								arrow={false}
								onClick={() => void handleRemoveTraining(entry.trainingId)}
							>
								Remove
							</Button>
						</li>
					))}
				</ul>

				{availableTrainings.length > 0 && (
					<form className="form card" onSubmit={event => void handleAddTraining(event)}>
						<label>
							Add training
							<select value={selectedTrainingId} onChange={event => setSelectedTrainingId(event.target.value)} required>
								<option value="" disabled>
									Select a training...
								</option>
								{availableTrainings.map(training => (
									<option key={training.id} value={training.id}>
										{training.title}
									</option>
								))}
							</select>
						</label>
						<Button type="submit" size="sm">
							Add
						</Button>
					</form>
				)}
			</div>
		</main>
	);
}
