import React from "react";

/** Cerios text input with rounded field, label and optional hint/invalid state. */
export function Input({ label, hint, invalid = false, id, style = {}, ...rest }) {
	const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
			{label && (
				<label htmlFor={inputId} style={{ fontSize: 15, fontWeight: 500, color: "var(--ce-navy-700)" }}>
					{label}
				</label>
			)}
			<input
				id={inputId}
				style={{
					fontFamily: "var(--font-sans)",
					fontSize: 17,
					color: "var(--ce-navy-700)",
					background: "#fff",
					padding: "14px 18px",
					borderRadius: "var(--radius-input)",
					border: `1.5px solid ${invalid ? "#d64545" : "var(--ce-divider-on-light)"}`,
					outline: "none",
					transition: "border-color 150ms ease",
				}}
				onFocus={e => {
					if (!invalid) e.target.style.borderColor = "var(--ce-navy-700)";
				}}
				onBlur={e => {
					if (!invalid) e.target.style.borderColor = "var(--ce-divider-on-light)";
				}}
				{...rest}
			/>
			{hint && <span style={{ fontSize: 13, color: invalid ? "#d64545" : "var(--ce-gray-400)" }}>{hint}</span>}
		</div>
	);
}
