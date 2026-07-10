import type {
	CompleteLessonResponse,
	GamificationAwardResultDto,
	LessonDto,
	TrainingDetailDto,
} from "@cerios/shared-types";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { apiClient } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { AppHeader, Badge, Button } from "../design-system";
import { GamificationToast } from "../gamification/GamificationToast";

export function TrainingViewerPage(): React.JSX.Element {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const { trainingId } = useParams<{ trainingId: string }>();
	const [training, setTraining] = useState<TrainingDetailDto | null>(null);
	const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [gamificationResult, setGamificationResult] = useState<GamificationAwardResultDto | null>(null);

	useEffect(() => {
		if (!trainingId) {
			return;
		}
		apiClient
			.get<TrainingDetailDto>(`/trainings/${trainingId}`)
			.then(loadedTraining => {
				setTraining(loadedTraining);
				const allLessons = loadedTraining.chapters.flatMap(chapter => chapter.lessons);
				const firstIncomplete = allLessons.find(lesson => !lesson.completedAt);
				setSelectedLessonId((firstIncomplete ?? allLessons[0])?.id ?? null);
			})
			.catch(console.error);
	}, [trainingId]);

	const selectedLesson = useMemo<LessonDto | null>(() => {
		if (!training || !selectedLessonId) {
			return null;
		}
		return training.chapters.flatMap(chapter => chapter.lessons).find(lesson => lesson.id === selectedLessonId) ?? null;
	}, [training, selectedLessonId]);

	const handleMarkComplete = async (): Promise<void> => {
		if (!trainingId || !selectedLesson || !training) {
			return;
		}
		setIsSaving(true);
		try {
			const result = await apiClient.post<CompleteLessonResponse>(
				`/trainings/${trainingId}/lessons/${selectedLesson.id}/complete`
			);
			setGamificationResult(result.gamification);
			setTraining(previous => {
				if (!previous) {
					return previous;
				}
				const chapters = previous.chapters.map(chapter => ({
					...chapter,
					lessons: chapter.lessons.map(lesson =>
						lesson.id === result.lessonId ? { ...lesson, completedAt: result.completedAt } : lesson
					),
				}));
				const allLessons = chapters.flatMap(chapter => chapter.lessons);
				const completedCount = allLessons.filter(lesson => lesson.completedAt).length;
				const progressPercentage = allLessons.length === 0 ? 0 : Math.round((completedCount / allLessons.length) * 100);
				return { ...previous, chapters, progressPercentage };
			});
		} finally {
			setIsSaving(false);
		}
	};

	if (!training) {
		return <p>Loading...</p>;
	}

	const handleDeleteTraining = async (): Promise<void> => {
		if (!trainingId) {
			return;
		}
		if (!window.confirm(`Delete "${training.title}"? This cannot be undone.`)) {
			return;
		}
		setIsDeleting(true);
		try {
			await apiClient.delete(`/authoring/trainings/${trainingId}`);
			void navigate("/trainings");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<main>
			{user && <AppHeader user={user} onLogout={() => void logout()} />}
			<div className="viewer">
				<nav className="viewer-nav">
					<Link className="back-link" to="/trainings">
						← My trainings
					</Link>
					<h2>{training.title}</h2>
					<progress value={training.progressPercentage} max={100} />
					<p className="progress-label">{training.progressPercentage}% complete</p>
					{user?.roles.includes("LD") && (
						<Button
							variant="cream"
							size="sm"
							arrow={false}
							disabled={isDeleting}
							onClick={() => void handleDeleteTraining()}
							style={{ color: "#d64545", marginBottom: 12 }}
						>
							{isDeleting ? "Deleting..." : "Delete training"}
						</Button>
					)}
					{training.chapters.map(chapter => (
						<div key={chapter.id}>
							<h3>{chapter.title}</h3>
							<ul className="lesson-list">
								{chapter.lessons.map(lesson => (
									<li key={lesson.id}>
										<button
											type="button"
											className={lesson.id === selectedLessonId ? "active" : ""}
											onClick={() => setSelectedLessonId(lesson.id)}
											style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
										>
											<span>{lesson.title}</span>
											<Badge tone={lesson.completedAt ? "green-dark" : "ink"} style={{ fontSize: 11 }}>
												{lesson.completedAt ? "Done" : "To do"}
											</Badge>
										</button>
									</li>
								))}
							</ul>
						</div>
					))}
					{training.hasQuiz && (
						<div style={{ marginTop: 16 }}>
							<Link to={`/trainings/${trainingId}/quiz`}>
								<Button variant="cream" size="sm" arrow={false} style={{ width: "100%" }}>
									{training.quizPassed ? "Toets bekijken (behaald)" : "Toets maken"}
								</Button>
							</Link>
						</div>
					)}
				</nav>
				<section className="viewer-content">
					{selectedLesson ? (
						<>
							<p className="breadcrumb">
								{training.title} / {selectedLesson.title}
							</p>
							<h1>{selectedLesson.title}</h1>
							<p className="lesson-body">{selectedLesson.contentBody}</p>
							<Button
								disabled={isSaving || Boolean(selectedLesson.completedAt)}
								onClick={() => void handleMarkComplete()}
							>
								{selectedLesson.completedAt ? "Completed" : isSaving ? "Saving..." : "Mark complete"}
							</Button>
						</>
					) : (
						<p>Select a lesson to get started.</p>
					)}
				</section>
			</div>
			<GamificationToast result={gamificationResult} onDismiss={() => setGamificationResult(null)} />
		</main>
	);
}
