# Cerios-Inspired Design System

A design system derived from the public **Cerios** website (cerios.com / cerios.nl) — a Dutch software-quality & IT-testing collective ("about software quality"). Built to let you produce on-brand Cerios-style interfaces and marketing pages.

> **Source & scope.** This system was reverse-engineered from **five mobile screenshots** of cerios.com/nl supplied by the user (see `uploads/`). No Cerios codebase, Figma file, or brand guidelines were provided, so exact hex values, the official webfont, and the logo mark are **best-effort approximations from the screenshots** — flagged below. Not affiliated with or endorsed by Cerios.

> **Font substitution.** The site's display face is a proprietary rounded grotesque. This system substitutes **Figtree** (Google Fonts, weights 300–800) — the closest free match for the friendly, slightly-rounded geometric look. If you have the real webfont, drop it into `tokens/` and swap the `@import` in `tokens/fonts.css` for `@font-face` rules.

> **Logo.** The Cerios interlocking looped-star mark was **not** supplied and is **not** reproduced. The `Wordmark` component renders "cerios" in plain type with the "about software quality" tagline. Replace with the official SVG when available.

---

## Index (manifest)

| Path                     | What it is                                                    |
| ------------------------ | ------------------------------------------------------------- |
| `styles.css`             | Global entry — `@import`s only. Consumers link this one file. |
| `tokens/fonts.css`       | Webfont loading (Figtree substitute).                         |
| `tokens/colors.css`      | Color custom properties + semantic aliases.                   |
| `tokens/typography.css`  | Font family, weights, type-role sizes.                        |
| `tokens/spacing.css`     | 4px spacing scale + usage tokens.                             |
| `tokens/radius.css`      | Radius scale (pills + rounded cards).                         |
| `tokens/base.css`        | Reset + `.ce-*` type-role utility classes.                    |
| `components/core/`       | Button, Card, Badge, Input.                                   |
| `components/navigation/` | NavBar, Accordion.                                            |
| `components/brand/`      | Wordmark.                                                     |
| `foundations/`           | Specimen cards for the Design System tab.                     |
| `ui_kits/marketing/`     | Interactive homepage recreation.                              |
| `SKILL.md`               | Agent-Skill entry point.                                      |

**Components:** Button · Card · Badge · Input · NavBar · Accordion · Wordmark.
**UI kits:** Marketing (homepage).

---

## Content fundamentals

**Voice: warm, direct, human — Dutch "no-nonsense" optimism.** Copy speaks _to_ the reader in second person ("jij / jouw / je") and about the company as "wij / we". It is confident and plain-spoken, never salesy.

- **Language.** Primary content is **Dutch**; navigation and the tagline mix in English ("Solutions", "about software quality", "Werken bij").
- **Casing.** **Sentence case everywhere** — including big display headlines ("Softwarekwaliteit die werkt voor jouw organisatie"). No uppercase shouting. Green eyebrows are sentence case too ("Ontwikkeling").
- **Headlines.** Short, benefit-led, often a full phrase rather than one word ("Ontwikkel expertise die verschil maakt", "Cerios about software quality").
- **Body.** Concrete and reassuring — states the promise then the proof ("Software moet doen wat het moet doen. En jij moet kunnen vertrouwen op wat je oplevert.").
- **CTAs.** Imperative, prefixed with a `→` arrow: "Onze vacatures", "Over Cerios", "Wat we doen", "Cerios Academy", "Contact".
- **Emoji.** Never.
- **Vibe.** Trustworthy, people-first, quietly energetic — "we help you stay ahead."

---

## Visual foundations

- **Color.** A **two-tone brand**: deep **navy** (`#1b2547` band, `#253358` ink) and a fresh **mint green** (`#68e19c`). Green is the single accent — primary CTAs, eyebrows, icon tiles, the nav status dot. Neutrals are white, **cream** (`#efeee8`, the soft secondary button), and a light gray band (`#f4f4f1`). Body text on light is a soft slate (`#55607a`).
- **Type.** One family (Figtree) carries everything. Headings are **bold (700) sentence case** with tight tracking (`-0.02em`); body is regular (400) at a comfortable 1.6 line-height. The contrast is weight + size, not casing.
- **Spacing.** 4px base. Bands breathe with ~64–80px vertical padding; 24px page gutters (mobile); cards pad at 32px.
- **Backgrounds.** Bands alternate **navy → light gray → navy → green**. The dark hero uses **full-bleed editorial photography** (real people at work) at ~50% opacity over navy, with a vertical navy gradient scrim for legibility. Dark content bands carry a **soft green radial glow** in one corner — the only decorative effect. No patterns, no textures.
- **Photography.** Real, warm, full-colour people-at-work imagery (portraits, meetings). Rounded to 16px inside content bands; full-bleed behind the hero.
- **Corner radii.** Everything is soft: **buttons are full pills** (999px), **cards 20px**, green icon tiles 24px, images 16px, inputs 14px. Bands/footers are square.
- **Cards.** Flat white, 20px radius, 32px padding, **no shadow**. A mint-green rounded icon tile (72px) sits top-left, then title, then body.
- **Buttons.** Full-pill, generous padding, a leading `→` arrow, label weight 600. Primary = green on navy text; secondary = cream; also navy and outline-on-dark variants.
- **Borders.** Hairlines only — 1px dividers (`rgba(37,51,88,.14)` on light, `rgba(255,255,255,.18)` on dark). Menu rows and nav bottom use them.
- **Shadows.** None. Depth comes from the navy↔light band polarity flips.
- **Animation.** Minimal, quick (~150ms ease). Buttons: green darkens / neutrals dim slightly on hover. Links: opacity lift. Accordion "+" rotates 45° to "×". No bounces, no parallax.
- **Layout.** Single-column mobile; stacked full-width bands; sticky white nav; full-screen navy menu overlay.

---

## Iconography

- **No icon set was provided.** UI glyphs (arrow, plus/close, hamburger) are drawn inline as **2px rounded-stroke** icons matching the brand's clean line look. If adopting a CDN set, **Lucide** is the closest match — flag any swap.
- Feature-card icons (books, people, certificate) are simple **filled** navy glyphs on the green tile — drawn inline in the UI kit as stand-ins; replace with the brand's real icons when available.
- **The looped-star brand mark is intentionally absent** (not supplied). Use the `Wordmark` component.
- **No emoji, no unicode characters used as icons.**
- **Assets:** photography in the UI kit is Unsplash placeholder — replace with real Cerios imagery.

---

## Do's and Don'ts

**Do** — keep headlines **sentence case** · use full-pill buttons with a `→` arrow · reserve green for CTAs, eyebrows and icon tiles · alternate navy/light/navy/green bands · pair the hero headline with full-bleed people photography · keep cards flat (no shadow).

**Don't** — uppercase the display type · introduce a second accent colour · put shadows on cards · use square-cornered buttons · reproduce the Cerios looped-star logo from memory · add emoji.
