import type { GamificationAwardResultDto, QuizAttemptResultDto, QuizDto } from "@cerios/shared-types";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { apiClient } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { AppHeader, Badge, Button } from "../design-system";
import { GamificationToast } from "../gamification/GamificationToast";

export function QuizPage(): React.JSX.Element {
	const { user, logout } = useAuth();
	const { trainingId } = useParams<{ trainingId: string }>();
	const [quiz, setQuiz] = useState<QuizDto | null>(null);
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [result, setResult] = useState<QuizAttemptResultDto | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [gamificationResult, setGamificationResult] = useState<GamificationAwardResultDto | null>(null);

	useEffect(() => {
		if (!trainingId) {
			return;
		}
		apiClient
			.get<QuizDto>(`/trainings/${trainingId}/quiz`)
			.then(setQuiz)
			.catch(() => setQuiz(null));
	}, [trainingId]);

	if (!trainingId || !quiz) {
		return <p>Loading...</p>;
	}

	const allAnswered = quiz.questions.every(question => Boolean(answers[question.id]));

	const handleSubmit = async (): Promise<void> => {
		setIsSubmitting(true);
		try {
			const request = { answers: Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId })) };
			const response = await apiClient.post<QuizAttemptResultDto>(`/trainings/${trainingId}/quiz/attempts`, request);
			setResult(response);
			setGamificationResult(response.gamification);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleRetry = (): void => {
		setResult(null);
		setAnswers({});
	};

	return (
		<main>
			{user && <AppHeader user={user} onLogout={() => void logout()} />}
			<div style={{ padding: "0 24px", maxWidth: 640 }}>
				<Link className="back-link" to={`/trainings/${trainingId}`}>
					← Terug naar training
				</Link>
				<h1>{quiz.title}</h1>
				<p style={{ color: "var(--ce-gray-400)" }}>Slagingsgrens: {quiz.passingScorePercentage}%</p>
				{quiz.attemptsCount > 0 && (
					<Badge tone={quiz.passed ? "green-dark" : "ink"} style={{ fontSize: 11 }}>
						{quiz.passed
							? `Behaald (beste score: ${quiz.bestScorePercentage}%)`
							: `Nog niet behaald (beste score: ${quiz.bestScorePercentage}%)`}
					</Badge>
				)}

				{result ? (
					<div className="card" style={{ margin: "16px 0" }}>
						<h2>{result.passed ? "Toets behaald!" : "Toets niet behaald"}</h2>
						<p>
							Score: {result.scorePercentage}% ({result.correctCount}/{result.totalQuestions} goed)
						</p>
						<Button onClick={handleRetry}>Opnieuw proberen</Button>
					</div>
				) : (
					<>
						{quiz.questions.map((question, index) => (
							<fieldset key={question.id} className="card" style={{ margin: "16px 0", border: "none" }}>
								<legend style={{ fontWeight: 600, marginBottom: 8 }}>
									{index + 1}. {question.text}
								</legend>
								{question.options.map(option => (
									<label key={option.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
										<input
											type="radio"
											name={question.id}
											value={option.id}
											checked={answers[question.id] === option.id}
											onChange={() => setAnswers(previous => ({ ...previous, [question.id]: option.id }))}
										/>
										{option.text}
									</label>
								))}
							</fieldset>
						))}
						<Button disabled={!allAnswered || isSubmitting} onClick={() => void handleSubmit()}>
							{isSubmitting ? "Versturen..." : "Toets indienen"}
						</Button>
					</>
				)}
			</div>
			<GamificationToast result={gamificationResult} onDismiss={() => setGamificationResult(null)} />
		</main>
	);
}
