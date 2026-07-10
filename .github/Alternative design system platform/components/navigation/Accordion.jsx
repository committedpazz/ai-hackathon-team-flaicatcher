import React from "react";

/**
 * Cerios menu accordion — large label rows separated by hairlines, each with a
 * "+" expander on the right. Used in the full-screen navy menu overlay.
 */
export function Accordion({ items = [], onDark = true, style = {} }) {
  const [open, setOpen] = React.useState(null);
  const labelColor = onDark ? "#fff" : "var(--ce-navy-700)";
  const line = onDark ? "var(--ce-divider-on-dark)" : "var(--ce-divider-on-light)";
  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ borderBottom: `1px solid ${line}` }}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "26px 4px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                fontSize: 30,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: labelColor,
                textAlign: "left",
              }}
            >
              <span>{it.label}</span>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0, transition: "transform 200ms ease", transform: isOpen ? "rotate(45deg)" : "none" }}>
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            {isOpen && it.children && (
              <div style={{ paddingBottom: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                {it.children.map((c, j) => (
                  <a key={j} href={c.href || "#"} style={{ fontSize: 19, fontWeight: 400, color: onDark ? "var(--ce-on-dark-body)" : "var(--ce-gray-600)" }}>
                    {c.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
