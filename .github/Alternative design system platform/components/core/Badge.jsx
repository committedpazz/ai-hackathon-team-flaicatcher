import React from "react";

/** Small green eyebrow / category label used above headings. */
export function Badge({ children, tone = "green", style = {} }) {
  const tones = {
    green: { color: "var(--ce-green-400)" },
    "green-dark": { color: "var(--ce-green-300)" },
    ink: { color: "var(--ce-navy-700)" },
  };
  return (
    <span
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 20,
        fontWeight: 500,
        lineHeight: 1.3,
        ...(tones[tone] || tones.green),
        ...style,
      }}
    >
      {children}
    </span>
  );
}
