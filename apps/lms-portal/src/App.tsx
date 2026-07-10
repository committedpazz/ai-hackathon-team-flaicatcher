import "./App.css";

import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./auth/ProtectedRoute";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { LoginPage } from "./pages/LoginPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
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
				</Route>
			</Routes>
		</div>
	);
}

export default App;
