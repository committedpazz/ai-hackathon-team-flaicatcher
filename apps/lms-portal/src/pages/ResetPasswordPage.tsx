import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { apiClient, ApiError } from "../api/client";

export function ResetPasswordPage(): React.JSX.Element {
	const { token } = useParams<{ token: string }>();
	const navigate = useNavigate();
	const [newPassword, setNewPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		if (!token) {
			return;
		}
		setError(null);
		setIsSubmitting(true);
		try {
			await apiClient.post("/auth/reset-password", { token, newPassword });
			void navigate("/login");
		} catch (submitError) {
			setError(submitError instanceof ApiError ? submitError.message : "Reset failed.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="card">
			<h1>Reset password</h1>
			<form className="form" onSubmit={event => void handleSubmit(event)}>
				<label>
					New password
					<input
						type="password"
						minLength={8}
						value={newPassword}
						onChange={event => setNewPassword(event.target.value)}
						required
					/>
				</label>
				{error && (
					<p className="alert" role="alert">
						{error}
					</p>
				)}
				<button className="button" type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Saving..." : "Set new password"}
				</button>
			</form>
			<Link className="muted-link" to="/login">
				Back to login
			</Link>
		</main>
	);
}
