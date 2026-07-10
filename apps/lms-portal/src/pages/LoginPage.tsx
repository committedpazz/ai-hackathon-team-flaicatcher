import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ApiError } from "../api/client";
import { useAuth } from "../auth/useAuth";

export function LoginPage(): React.JSX.Element {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);
		try {
			await login(username, password);
			void navigate("/trainings");
		} catch (submitError) {
			setError(submitError instanceof ApiError ? submitError.message : "Login failed.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main>
			<h1>Log in</h1>
			<form onSubmit={event => void handleSubmit(event)}>
				<label>
					Username
					<input value={username} onChange={event => setUsername(event.target.value)} required />
				</label>
				<label>
					Password
					<input type="password" value={password} onChange={event => setPassword(event.target.value)} required />
				</label>
				{error && <p role="alert">{error}</p>}
				<button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Logging in..." : "Log in"}
				</button>
			</form>
			<p>
				<Link to="/forgot-password">Forgot password?</Link>
			</p>
		</main>
	);
}
