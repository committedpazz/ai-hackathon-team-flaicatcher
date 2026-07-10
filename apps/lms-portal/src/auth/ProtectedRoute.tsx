import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "./useAuth";

export function ProtectedRoute(): React.JSX.Element {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}
