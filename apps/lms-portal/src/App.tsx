import "./App.css";

import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AuthoringListPage } from "./pages/AuthoringListPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { LearningPathAuthoringListPage } from "./pages/LearningPathAuthoringListPage";
import { LearningPathDetailPage } from "./pages/LearningPathDetailPage";
import { LearningPathEditorPage } from "./pages/LearningPathEditorPage";
import { LearningPathsListPage } from "./pages/LearningPathsListPage";
import { LoginPage } from "./pages/LoginPage";
import { QuizPage } from "./pages/QuizPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { TrainingEditorPage } from "./pages/TrainingEditorPage";
import { TrainingsListPage } from "./pages/TrainingsListPage";
import { TrainingViewerPage } from "./pages/TrainingViewerPage";

function App(): React.JSX.Element {
	return (
		<div className="app">
			<Routes>
				<Route path="/" element={<Navigate to="/trainings" replace />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/forgot-password" element={<ForgotPasswordPage />} />
				<Route path="/reset-password/:token" element={<ResetPasswordPage />} />
				<Route element={<ProtectedRoute />}>
					<Route path="/trainings" element={<TrainingsListPage />} />
					<Route path="/trainings/:trainingId" element={<TrainingViewerPage />} />
					<Route path="/trainings/:trainingId/quiz" element={<QuizPage />} />
					<Route path="/learning-paths" element={<LearningPathsListPage />} />
					<Route path="/learning-paths/:learningPathId" element={<LearningPathDetailPage />} />
					<Route path="/authoring" element={<AuthoringListPage />} />
					<Route path="/authoring/:trainingId" element={<TrainingEditorPage />} />
					<Route path="/authoring/learning-paths" element={<LearningPathAuthoringListPage />} />
					<Route path="/authoring/learning-paths/:learningPathId" element={<LearningPathEditorPage />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;
