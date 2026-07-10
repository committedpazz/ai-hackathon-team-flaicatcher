import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { apiClient } from "../api/client";
import { Button, Input } from "../design-system";

export function ForgotPasswordPage(): React.JSX.Element {
	const [username, setUsername] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		setIsSubmitting(true);
		try {
			await apiClient.post("/auth/forgot-password", { username });
		} finally {
			setIsSubmitting(false);
			setIsSubmitted(true);
		}
	};

	if (isSubmitted) {
		return (
			<main className="card">
				<h1>Forgot password</h1>
				<p>If an account with that username exists, a reset link has been sent.</p>
				<Link className="muted-link" to="/login">
					Back to login
				</Link>
			</main>
		);
	}

	return (
		<main className="card">
			<h1>Forgot password</h1>
			<form className="form" onSubmit={event => void handleSubmit(event)}>
				<Input label="Username" value={username} onChange={event => setUsername(event.target.value)} required />
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Sending..." : "Send reset link"}
				</Button>
			</form>
			<Link className="muted-link" to="/login">
				Back to login
			</Link>
		</main>
	);
}
