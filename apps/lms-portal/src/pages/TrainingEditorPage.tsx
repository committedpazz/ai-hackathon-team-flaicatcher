import type {
	AuthoredQuizDto,
	ChapterDto,
	CreateQuizRequest,
	LessonDto,
	TrainingDetailDto,
} from "@cerios/shared-types";
import { LessonContentType } from "@cerios/shared-types";
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import { apiClient } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { AppHeader, Badge, Button, Input } from "../design-system";

export function TrainingEditorPage(): React.JSX.Element {
	const { user, logout } = useAuth();
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
		<main>
			{user && <AppHeader user={user} onLogout={() => void logout()} />}
			<div className="viewer">
				<nav className="viewer-nav">
					<Link className="back-link" to="/authoring">
						← My authored trainings
					</Link>
					<h2>{training.title}</h2>
					<Badge tone={training.status === "PUBLISHED" ? "green-dark" : "ink"} style={{ fontSize: 11 }}>
						{training.status === "PUBLISHED" ? "Published" : "Draft"}
					</Badge>
				</nav>
				<section className="viewer-content">
					<TrainingMetadataForm training={training} trainingId={trainingId} onChanged={reload} />
					<h3>Chapters</h3>
					{training.chapters.map(chapter => (
						<ChapterEditor key={chapter.id} chapter={chapter} onChanged={reload} />
					))}
					<AddChapterForm trainingId={trainingId} nextOrder={training.chapters.length + 1} onChanged={reload} />
					<h3 style={{ marginTop: 32 }}>Quiz</h3>
					<QuizEditor trainingId={trainingId} />
				</section>
			</div>
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
	const [gamificationEnabled, setGamificationEnabled] = useState(training.gamificationEnabled);
	const [isSaving, setIsSaving] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);

	const handleSave = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		setIsSaving(true);
		try {
			await apiClient.patch(`/authoring/trainings/${trainingId}`, {
				title,
				description,
				level,
				language,
				gamificationEnabled,
			});
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
			<Input label="Title" value={title} onChange={event => setTitle(event.target.value)} required />
			<Input label="Description" value={description} onChange={event => setDescription(event.target.value)} required />
			<Input label="Level" value={level} onChange={event => setLevel(event.target.value)} required />
			<Input label="Language" value={language} onChange={event => setLanguage(event.target.value)} required />
			<label style={{ display: "flex", alignItems: "center", gap: 8 }}>
				<input
					type="checkbox"
					checked={gamificationEnabled}
					onChange={event => setGamificationEnabled(event.target.checked)}
				/>
				Gamification (punten, badges, mijlpalen) inschakelen voor deze training
			</label>
			<div className="progress-row">
				<Button type="submit" size="sm" disabled={isSaving}>
					{isSaving ? "Saving..." : "Save"}
				</Button>
				{training.status === "DRAFT" && (
					<Button variant="cream" size="sm" disabled={isPublishing} onClick={() => void handlePublish()}>
						{isPublishing ? "Publishing..." : "Publish"}
					</Button>
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
				<Input label="Chapter title" value={title} onChange={event => setTitle(event.target.value)} required />
				<Input
					label="Order"
					type="number"
					min={1}
					value={order}
					onChange={event => setOrder(Number(event.target.value))}
					required
				/>
				<div className="progress-row">
					<Button type="submit" size="sm" disabled={isSaving}>
						{isSaving ? "Saving..." : "Save chapter"}
					</Button>
					<Button variant="cream" size="sm" disabled={isDeleting} onClick={() => void handleDelete()}>
						{isDeleting ? "Deleting..." : "Delete chapter"}
					</Button>
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
				<Input label="Lesson title" value={title} onChange={event => setTitle(event.target.value)} required />
				<Input
					label="Order"
					type="number"
					min={1}
					value={order}
					onChange={event => setOrder(Number(event.target.value))}
					required
				/>
				<label>
					Content
					<textarea rows={3} value={contentBody} onChange={event => setContentBody(event.target.value)} required />
				</label>
				<div className="progress-row">
					<Button type="submit" size="sm" disabled={isSaving}>
						{isSaving ? "Saving..." : "Save lesson"}
					</Button>
					<Button variant="cream" size="sm" disabled={isDeleting} onClick={() => void handleDelete()}>
						{isDeleting ? "Deleting..." : "Delete lesson"}
					</Button>
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
			<Input label="New chapter title" value={title} onChange={event => setTitle(event.target.value)} required />
			<Input
				label="Order"
				type="number"
				min={1}
				value={order}
				onChange={event => setOrder(Number(event.target.value))}
				required
			/>
			<Button type="submit" size="sm" disabled={isSubmitting}>
				{isSubmitting ? "Adding..." : "Add chapter"}
			</Button>
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
			<Input label="New lesson title" value={title} onChange={event => setTitle(event.target.value)} required />
			<Input
				label="Order"
				type="number"
				min={1}
				value={order}
				onChange={event => setOrder(Number(event.target.value))}
				required
			/>
			<label>
				Content
				<textarea rows={3} value={contentBody} onChange={event => setContentBody(event.target.value)} required />
			</label>
			<Button type="submit" size="sm" disabled={isSubmitting}>
				{isSubmitting ? "Adding..." : "Add lesson"}
			</Button>
		</form>
	);
}

interface EditableOption {
	key: string;
	text: string;
	isCorrect: boolean;
}

interface EditableQuestion {
	key: string;
	text: string;
	options: EditableOption[];
}

function toEditableQuestions(quiz: AuthoredQuizDto | null): EditableQuestion[] {
	if (!quiz) {
		return [];
	}
	return quiz.questions.map(question => ({
		key: question.id,
		text: question.text,
		options: question.options.map(option => ({ key: option.id, text: option.text, isCorrect: option.isCorrect })),
	}));
}

/** Simple quiz authoring editor: one training has at most one quiz (spec 5.5.2 / 5.5.5). */
function QuizEditor({ trainingId }: { trainingId: string }): React.JSX.Element {
	const [quiz, setQuiz] = useState<AuthoredQuizDto | null>(null);
	const [loaded, setLoaded] = useState(false);
	const [title, setTitle] = useState("Eindtoets");
	const [passingScorePercentage, setPassingScorePercentage] = useState(70);
	const [questions, setQuestions] = useState<EditableQuestion[]>([]);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		apiClient
			.get<AuthoredQuizDto | null>(`/authoring/trainings/${trainingId}/quiz`)
			.then(loadedQuiz => {
				setQuiz(loadedQuiz);
				if (loadedQuiz) {
					setTitle(loadedQuiz.title);
					setPassingScorePercentage(loadedQuiz.passingScorePercentage);
					setQuestions(toEditableQuestions(loadedQuiz));
				}
				setLoaded(true);
			})
			.catch(() => setLoaded(true));
	}, [trainingId]);

	if (!loaded) {
		return <p>Loading quiz...</p>;
	}

	const addQuestion = (): void => {
		setQuestions(previous => [
			...previous,
			{
				key: crypto.randomUUID(),
				text: "",
				options: [
					{ key: crypto.randomUUID(), text: "", isCorrect: true },
					{ key: crypto.randomUUID(), text: "", isCorrect: false },
				],
			},
		]);
	};

	const removeQuestion = (key: string): void => {
		setQuestions(previous => previous.filter(question => question.key !== key));
	};

	const updateQuestionText = (key: string, text: string): void => {
		setQuestions(previous => previous.map(question => (question.key === key ? { ...question, text } : question)));
	};

	const addOption = (questionKey: string): void => {
		setQuestions(previous =>
			previous.map(question =>
				question.key === questionKey
					? { ...question, options: [...question.options, { key: crypto.randomUUID(), text: "", isCorrect: false }] }
					: question
			)
		);
	};

	const removeOption = (questionKey: string, optionKey: string): void => {
		setQuestions(previous =>
			previous.map(question =>
				question.key === questionKey
					? { ...question, options: question.options.filter(option => option.key !== optionKey) }
					: question
			)
		);
	};

	const updateOptionText = (questionKey: string, optionKey: string, text: string): void => {
		setQuestions(previous =>
			previous.map(question =>
				question.key === questionKey
					? {
							...question,
							options: question.options.map(option => (option.key === optionKey ? { ...option, text } : option)),
						}
					: question
			)
		);
	};

	const setCorrectOption = (questionKey: string, optionKey: string): void => {
		setQuestions(previous =>
			previous.map(question =>
				question.key === questionKey
					? {
							...question,
							options: question.options.map(option => ({ ...option, isCorrect: option.key === optionKey })),
						}
					: question
			)
		);
	};

	const handleSave = async (): Promise<void> => {
		setIsSaving(true);
		try {
			const request: CreateQuizRequest = {
				title,
				passingScorePercentage,
				questions: questions.map((question, questionIndex) => ({
					text: question.text,
					order: questionIndex + 1,
					options: question.options.map((option, optionIndex) => ({
						text: option.text,
						isCorrect: option.isCorrect,
						order: optionIndex + 1,
					})),
				})),
			};
			const saved = await apiClient.put<AuthoredQuizDto>(`/authoring/trainings/${trainingId}/quiz`, request);
			setQuiz(saved);
			setQuestions(toEditableQuestions(saved));
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async (): Promise<void> => {
		setIsDeleting(true);
		try {
			await apiClient.delete(`/authoring/trainings/${trainingId}/quiz`);
			setQuiz(null);
			setQuestions([]);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="card">
			{!quiz && questions.length === 0 && <p>This training has no quiz yet.</p>}
			<Input label="Quiz title" value={title} onChange={event => setTitle(event.target.value)} required />
			<Input
				label="Passing score (%)"
				type="number"
				min={0}
				max={100}
				value={passingScorePercentage}
				onChange={event => setPassingScorePercentage(Number(event.target.value))}
				required
			/>

			{questions.map((question, questionIndex) => (
				<div key={question.key} className="card" style={{ margin: "12px 0", background: "var(--ce-cream)" }}>
					<Input
						label={`Question ${questionIndex + 1}`}
						value={question.text}
						onChange={event => updateQuestionText(question.key, event.target.value)}
						required
					/>
					{question.options.map(option => (
						<div key={option.key} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
							<input
								type="radio"
								name={`correct-${question.key}`}
								checked={option.isCorrect}
								onChange={() => setCorrectOption(question.key, option.key)}
								title="Correct answer"
							/>
							<Input
								value={option.text}
								onChange={event => updateOptionText(question.key, option.key, event.target.value)}
								placeholder="Option text"
								required
								style={{ flex: 1 }}
							/>
							<Button
								variant="cream"
								size="sm"
								arrow={false}
								disabled={question.options.length <= 2}
								onClick={() => removeOption(question.key, option.key)}
							>
								Remove
							</Button>
						</div>
					))}
					<div className="progress-row" style={{ marginTop: 8 }}>
						<Button variant="cream" size="sm" arrow={false} onClick={() => addOption(question.key)}>
							Add option
						</Button>
						<Button variant="cream" size="sm" arrow={false} onClick={() => removeQuestion(question.key)}>
							Remove question
						</Button>
					</div>
				</div>
			))}

			<div className="progress-row" style={{ marginTop: 12 }}>
				<Button variant="cream" size="sm" arrow={false} onClick={addQuestion}>
					Add question
				</Button>
				<Button size="sm" disabled={isSaving || questions.length === 0} onClick={() => void handleSave()}>
					{isSaving ? "Saving..." : "Save quiz"}
				</Button>
				{quiz && (
					<Button
						variant="cream"
						size="sm"
						arrow={false}
						disabled={isDeleting}
						style={{ color: "#d64545" }}
						onClick={() => void handleDelete()}
					>
						{isDeleting ? "Deleting..." : "Delete quiz"}
					</Button>
				)}
			</div>
		</div>
	);
}
