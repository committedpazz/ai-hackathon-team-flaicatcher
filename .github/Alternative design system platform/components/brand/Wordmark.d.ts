import React from "react";

export interface WordmarkProps {
  /** Render white for dark backgrounds. @default false */
  onDark?: boolean;
  /** Font size of "cerios" in px. @default 34 */
  size?: number;
  /** Show the "about software quality" tagline block. @default true */
  tagline?: boolean;
  style?: React.CSSProperties;
}

/** The Cerios wordmark (type-only stand-in — official mark not supplied). */
export function Wordmark(props: WordmarkProps): JSX.Element;
