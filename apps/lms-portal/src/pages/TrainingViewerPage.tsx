import type { CompleteLessonResponse, LessonDto, TrainingDetailDto } from "@cerios/shared-types";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { apiClient } from "../api/client";

export function TrainingViewerPage(): React.JSX.Element {
	const { trainingId } = useParams<{ trainingId: string }>();
	const [training, setTraining] = useState<TrainingDetailDto | null>(null);
	const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

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

	return (
		<main style={{ display: "flex", gap: "2rem" }}>
			<nav style={{ minWidth: "220px" }}>
				<p>
					<Link to="/trainings">← My trainings</Link>
				</p>
				<h2>{training.title}</h2>
				<progress value={training.progressPercentage} max={100} />
				<span> {training.progressPercentage}%</span>
				{training.chapters.map(chapter => (
					<div key={chapter.id}>
						<h3>{chapter.title}</h3>
						<ul>
							{chapter.lessons.map(lesson => (
								<li key={lesson.id}>
									<button type="button" onClick={() => setSelectedLessonId(lesson.id)}>
										{lesson.completedAt ? "✅" : "⬜"} {lesson.title}
									</button>
								</li>
							))}
						</ul>
					</div>
				))}
			</nav>
			<section>
				{selectedLesson ? (
					<>
						<p>
							{training.title} / {selectedLesson.title}
						</p>
						<h1>{selectedLesson.title}</h1>
						<p>{selectedLesson.contentBody}</p>
						<button
							type="button"
							disabled={isSaving || Boolean(selectedLesson.completedAt)}
							onClick={() => void handleMarkComplete()}
						>
							{selectedLesson.completedAt ? "Completed" : isSaving ? "Saving..." : "Mark complete"}
						</button>
					</>
				) : (
					<p>Select a lesson to get started.</p>
				)}
			</section>
		</main>
	);
}
