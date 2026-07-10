import type { InputHTMLAttributes } from "react";
import { useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	hint?: string;
	invalid?: boolean;
}

/** Cerios text input with rounded field, label and optional hint/invalid state. */
export function Input({ label, hint, invalid = false, id, style, ...rest }: InputProps): React.JSX.Element {
	const generatedId = useId();
	const inputId = id ?? generatedId;

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
			{label && (
				<label htmlFor={inputId} style={{ fontSize: 14, fontWeight: 500, color: "var(--ce-navy-700)" }}>
					{label}
				</label>
			)}
			<input
				id={inputId}
				style={{
					fontFamily: "var(--font-sans)",
					fontSize: 16,
					color: "var(--ce-navy-700)",
					background: "#fff",
					padding: "12px 16px",
					borderRadius: "var(--radius-input)",
					border: `1.5px solid ${invalid ? "#d64545" : "var(--ce-divider-on-light)"}`,
					outline: "none",
					transition: "border-color 150ms ease",
				}}
				{...rest}
			/>
			{hint && <span style={{ fontSize: 13, color: invalid ? "#d64545" : "var(--ce-gray-400)" }}>{hint}</span>}
		</div>
	);
}
