import React from "react";

export interface ButtonProps {
  children: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: "primary" | "cream" | "navy" | "outline-on-dark";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Show the leading arrow glyph. @default true */
  arrow?: boolean;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: React.CSSProperties;
}

/**
 * The Cerios call-to-action pill.
 * @startingPoint section="Core" subtitle="Pill CTA with leading arrow" viewport="700x160"
 */
export function Button(props: ButtonProps): JSX.Element;
