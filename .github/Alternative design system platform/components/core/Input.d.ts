import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  invalid?: boolean;
}

/** Rounded text input with label + hint. */
export function Input(props: InputProps): JSX.Element;
