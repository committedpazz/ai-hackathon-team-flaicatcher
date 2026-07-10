import type { ChapterDto, LessonDto, TrainingDetailDto } from "@cerios/shared-types";
import { LessonContentType } from "@cerios/shared-types";
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import { apiClient } from "../api/client";

export function TrainingEditorPage(): React.JSX.Element {
	const { trainingId } = useParams<{ trainingId: string }>();
	const [training, setTraining] = useState<TrainingDetailDto | null>(null);

	const reload = useCallback((): void => {
		if (!trainingId) {
			return;
		}
		apiClient.get<TrainingDetailDto>(`/trainings/${trainingId}`).then(setTraining).catch(console.error);
	}, [trainingId]);

	useEffect(() => {
		reload();
	}, [reload]);

	if (!training || !trainingId) {
		return <p>Loading...</p>;
	}

	return (
		<main className="viewer">
			<nav className="viewer-nav">
				<Link className="back-link" to="/authoring">
					← My authored trainings
				</Link>
				<h2>{training.title}</h2>
				<p className="progress-label">Status: {training.status}</p>
			</nav>
			<section className="viewer-content">
				<TrainingMetadataForm training={training} trainingId={trainingId} onChanged={reload} />
				<h3>Chapters</h3>
				{training.chapters.map(chapter => (
					<ChapterEditor key={chapter.id} chapter={chapter} onChanged={reload} />
				))}
				<AddChapterForm trainingId={trainingId} nextOrder={training.chapters.length + 1} onChanged={reload} />
			</section>
		</main>
	);
}

function TrainingMetadataForm({
	training,
	trainingId,
	onChanged,
}: {
	training: TrainingDetailDto;
	trainingId: string;
	onChanged: () => void;
}): React.JSX.Element {
	const [title, setTitle] = useState(training.title);
	const [description, setDescription] = useState(training.description);
	const [level, setLevel] = useState(training.level);
	const [language, setLanguage] = useState(training.language);
	const [isSaving, setIsSaving] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);

	const handleSave = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		setIsSaving(true);
		try {
			await apiClient.patch(`/authoring/trainings/${trainingId}`, { title, description, level, language });
			onChanged();
		} finally {
			setIsSaving(false);
		}
	};

	const handlePublish = async (): Promise<void> => {
		setIsPublishing(true);
		try {
			await apiClient.post(`/authoring/trainings/${trainingId}/publish`);
			onChanged();
		} finally {
			setIsPublishing(false);
		}
	};

	return (
		<form className="form" onSubmit={event => void handleSave(event)}>
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
			<div className="progress-row">
				<button className="button" type="submit" disabled={isSaving}>
					{isSaving ? "Saving..." : "Save"}
				</button>
				{training.status === "DRAFT" && (
					<button
						className="button button-secondary"
						type="button"
						disabled={isPublishing}
						onClick={() => void handlePublish()}
					>
						{isPublishing ? "Publishing..." : "Publish"}
					</button>
				)}
			</div>
		</form>
	);
}

function ChapterEditor({ chapter, onChanged }: { chapter: ChapterDto; onChanged: () => void }): React.JSX.Element {
	const [title, setTitle] = useState(chapter.title);
	const [order, setOrder] = useState(chapter.order);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleSave = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		setIsSaving(true);
		try {
			await apiClient.patch(`/authoring/chapters/${chapter.id}`, { title, order });
			onChanged();
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async (): Promise<void> => {
		setIsDeleting(true);
		try {
			await apiClient.delete(`/authoring/chapters/${chapter.id}`);
			onChanged();
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="card" style={{ margin: "16px 0" }}>
			<form className="form" onSubmit={event => void handleSave(event)}>
				<label>
					Chapter title
					<input value={title} onChange={event => setTitle(event.target.value)} required />
				</label>
				<label>
					Order
					<input
						type="number"
						min={1}
						value={order}
						onChange={event => setOrder(Number(event.target.value))}
						required
					/>
				</label>
				<div className="progress-row">
					<button className="button" type="submit" disabled={isSaving}>
						{isSaving ? "Saving..." : "Save chapter"}
					</button>
					<button
						className="button button-secondary"
						type="button"
						disabled={isDeleting}
						onClick={() => void handleDelete()}
					>
						{isDeleting ? "Deleting..." : "Delete chapter"}
					</button>
				</div>
			</form>

			<ul className="lesson-list" style={{ marginTop: "12px" }}>
				{chapter.lessons.map(lesson => (
					<LessonEditor key={lesson.id} lesson={lesson} onChanged={onChanged} />
				))}
			</ul>
			<AddLessonForm chapterId={chapter.id} nextOrder={chapter.lessons.length + 1} onChanged={onChanged} />
		</div>
	);
}

function LessonEditor({ lesson, onChanged }: { lesson: LessonDto; onChanged: () => void }): React.JSX.Element {
	const [title, setTitle] = useState(lesson.title);
	const [order, setOrder] = useState(lesson.order);
	const [contentBody, setContentBody] = useState(lesson.contentBody);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleSave = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		setIsSaving(true);
		try {
			await apiClient.patch(`/authoring/lessons/${lesson.id}`, { title, order, contentBody });
			onChanged();
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async (): Promise<void> => {
		setIsDeleting(true);
		try {
			await apiClient.delete(`/authoring/lessons/${lesson.id}`);
			onChanged();
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<li>
			<form className="form" onSubmit={event => void handleSave(event)}>
				<label>
					Lesson title
					<input value={title} onChange={event => setTitle(event.target.value)} required />
				</label>
				<label>
					Order
					<input
						type="number"
						min={1}
						value={order}
						onChange={event => setOrder(Number(event.target.value))}
						required
					/>
				</label>
				<label>
					Content
					<textarea rows={3} value={contentBody} onChange={event => setContentBody(event.target.value)} required />
				</label>
				<div className="progress-row">
					<button className="button" type="submit" disabled={isSaving}>
						{isSaving ? "Saving..." : "Save lesson"}
					</button>
					<button
						className="button button-secondary"
						type="button"
						disabled={isDeleting}
						onClick={() => void handleDelete()}
					>
						{isDeleting ? "Deleting..." : "Delete lesson"}
					</button>
				</div>
			</form>
		</li>
	);
}

function AddChapterForm({
	trainingId,
	nextOrder,
	onChanged,
}: {
	trainingId: string;
	nextOrder: number;
	onChanged: () => void;
}): React.JSX.Element {
	const [title, setTitle] = useState("");
	const [order, setOrder] = useState(nextOrder);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		setIsSubmitting(true);
		try {
			await apiClient.post(`/authoring/trainings/${trainingId}/chapters`, { title, order });
			setTitle("");
			setOrder(nextOrder + 1);
			onChanged();
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form className="form card" onSubmit={event => void handleSubmit(event)}>
			<label>
				New chapter title
				<input value={title} onChange={event => setTitle(event.target.value)} required />
			</label>
			<label>
				Order
				<input type="number" min={1} value={order} onChange={event => setOrder(Number(event.target.value))} required />
			</label>
			<button className="button" type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Adding..." : "Add chapter"}
			</button>
		</form>
	);
}

function AddLessonForm({
	chapterId,
	nextOrder,
	onChanged,
}: {
	chapterId: string;
	nextOrder: number;
	onChanged: () => void;
}): React.JSX.Element {
	const [title, setTitle] = useState("");
	const [order, setOrder] = useState(nextOrder);
	const [contentBody, setContentBody] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		setIsSubmitting(true);
		try {
			await apiClient.post(`/authoring/chapters/${chapterId}/lessons`, {
				title,
				order,
				contentType: LessonContentType.TEXT,
				contentBody,
			});
			setTitle("");
			setContentBody("");
			setOrder(nextOrder + 1);
			onChanged();
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form className="form" onSubmit={event => void handleSubmit(event)}>
			<label>
				New lesson title
				<input value={title} onChange={event => setTitle(event.target.value)} required />
			</label>
			<label>
				Order
				<input type="number" min={1} value={order} onChange={event => setOrder(Number(event.target.value))} required />
			</label>
			<label>
				Content
				<textarea rows={3} value={contentBody} onChange={event => setContentBody(event.target.value)} required />
			</label>
			<button className="button" type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Adding..." : "Add lesson"}
			</button>
		</form>
	);
}
