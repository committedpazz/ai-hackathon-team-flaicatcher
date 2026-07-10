import type { AuthenticatedUser } from "@cerios/shared-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { apiClient } from "../api/client";

import { AuthContext } from "./auth-context";
import type { AuthContextValue } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
	const [user, setUser] = useState<AuthenticatedUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		apiClient
			.get<AuthenticatedUser>("/auth/me")
			.then(setUser)
			.catch(() => setUser(null))
			.finally(() => setIsLoading(false));
	}, []);

	const login = useCallback(async (username: string, password: string): Promise<void> => {
		const loggedInUser = await apiClient.post<AuthenticatedUser>("/auth/login", { username, password });
		setUser(loggedInUser);
	}, []);

	const logout = useCallback(async (): Promise<void> => {
		await apiClient.post("/auth/logout");
		setUser(null);
	}, []);

	const value = useMemo<AuthContextValue>(() => ({ user, isLoading, login, logout }), [user, isLoading, login, logout]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
