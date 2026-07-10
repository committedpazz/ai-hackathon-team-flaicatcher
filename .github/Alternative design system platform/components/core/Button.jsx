import React from "react";

/**
 * Cerios pill button. Every button is a full pill with an optional leading arrow.
 * variant: "primary" (mint green) | "cream" (soft) | "navy" (dark) | "outline-on-dark"
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  arrow = true,
  href,
  onClick,
  type = "button",
  disabled = false,
  style = {},
}) {
  const sizes = {
    sm: { padding: "10px 20px", fontSize: 15, gap: 8 },
    md: { padding: "16px 30px", fontSize: 18, gap: 12 },
    lg: { padding: "20px 38px", fontSize: 20, gap: 14 },
  };
  const variants = {
    primary: { background: "var(--ce-green-400)", color: "var(--ce-navy-800)", border: "1px solid transparent" },
    cream: { background: "var(--ce-cream)", color: "var(--ce-navy-700)", border: "1px solid transparent" },
    navy: { background: "var(--ce-navy-900)", color: "#fff", border: "1px solid transparent" },
    "outline-on-dark": { background: "transparent", color: "#fff", border: "1px solid var(--ce-divider-on-dark)" },
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: s.gap,
    padding: s.padding,
    fontFamily: "var(--font-sans)",
    fontSize: s.fontSize,
    fontWeight: 600,
    lineHeight: 1,
    borderRadius: "var(--radius-pill)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    textDecoration: "none",
    transition: "filter 150ms ease, background 150ms ease",
    whiteSpace: "nowrap",
    ...v,
    ...style,
  };

  const [hover, setHover] = React.useState(false);
  const hoverStyle = hover && !disabled
    ? (variant === "primary"
        ? { background: "var(--ce-green-500)" }
        : { filter: "brightness(0.96)" })
    : {};

  const content = (
    <>
      {arrow && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
          <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <span>{children}</span>
    </>
  );

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  };

  if (href) {
    return (
      <a href={href} style={{ ...base, ...hoverStyle }} {...handlers}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...hoverStyle }} {...handlers}>
      {content}
    </button>
  );
}
