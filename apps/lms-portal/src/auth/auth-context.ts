import type { AuthenticatedUser } from "@cerios/shared-types";
import { createContext } from "react";

export interface AuthContextValue {
    user: AuthenticatedUser | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
