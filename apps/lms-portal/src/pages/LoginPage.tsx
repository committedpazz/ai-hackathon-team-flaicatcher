import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ApiError } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { Button, Input } from "../design-system";

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
			// Clear the password on failure. Some browsers/password managers set the
			// input's value without firing a proper change event, which can leave
			// React's state out of sync with what the field visually shows. Forcing
			// the user to retype a fresh value avoids submitting a stale password.
			setPassword("");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="card">
			<h1>Log in</h1>
			<form className="form" onSubmit={event => void handleSubmit(event)}>
				<Input
					label="Username"
					value={username}
					onChange={event => setUsername(event.target.value)}
					autoComplete="username"
					required
				/>
				<Input
					label="Password"
					type="password"
					value={password}
					onChange={event => setPassword(event.target.value)}
					autoComplete="current-password"
					required
				/>
				{error && (
					<p className="alert" role="alert">
						{error}
					</p>
				)}
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Logging in..." : "Log in"}
				</Button>
			</form>
			<Link className="muted-link" to="/forgot-password">
				Forgot password?
			</Link>
		</main>
	);
}
