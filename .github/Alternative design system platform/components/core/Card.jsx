import React from "react";

/**
 * Cerios feature card — white rounded card with a green icon tile, title and body.
 * Used in content grids (e.g. the Academy band).
 */
export function Card({ icon, title, body, style = {} }) {
  return (
    <div
      style={{
        background: "var(--surface-card)",
        borderRadius: "var(--radius-card)",
        padding: "var(--card-pad)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        ...style,
      }}
    >
      {icon && (
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "var(--radius-tile)",
            background: "var(--ce-green-400)",
            color: "var(--ce-navy-800)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h3 className="ce-h3" style={{ fontSize: 24 }}>{title}</h3>
        <p className="ce-body" style={{ color: "var(--ce-gray-600)" }}>{body}</p>
      </div>
    </div>
  );
}
