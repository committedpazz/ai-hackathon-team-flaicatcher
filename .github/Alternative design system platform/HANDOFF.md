# Cerios-style design — handoff guide

Everything you need to build your new app in this visual style. Two ways to use it.

## Quickest start — the `starter/` folder

`starter/index.html` + `starter/cerios-theme.css` are a self-contained, working page.
Open `index.html` in a browser, or drop both files into your project. Edit the copy/sections
to build your own pages. It links the one stylesheet and defines the UI components (Button,
Card, NavBar, Accordion, etc.) inline so you can see exactly how they're built.

## The stylesheet — `cerios-theme.css`

One drop-in file. Link it once:

```html
<link rel="stylesheet" href="cerios-theme.css" />
```

Then use the design tokens and type classes anywhere:

```html
<h1 class="ce-display">Softwarekwaliteit die werkt</h1>
<p class="ce-body">...</p>
<button
	style="background: var(--ce-green-400); color: var(--ce-navy-800);
               border-radius: var(--radius-pill); padding: 16px 30px;"
>
	Contact
</button>
```

Key tokens:

- Colors: `--ce-navy-900` `#1b2547`, `--ce-navy-800` `#253358`, `--ce-green-400` `#68e19c`,
  `--ce-cream` `#efeee8`, `--ce-gray-50` `#f4f4f1`
- Type classes: `.ce-display` `.ce-h2` `.ce-h3` `.ce-eyebrow` `.ce-body-lg` `.ce-body` `.ce-caption`
- Radii: `--radius-pill` (buttons), `--radius-card` (20px), `--radius-image` (16px)
- Font: Figtree (loaded automatically from Google Fonts)

## For a React app — the components

`components/` holds clean React source you can copy into your codebase:
`Button.jsx`, `Card.jsx`, `Badge.jsx`, `Input.jsx`, `NavBar.jsx`, `Accordion.jsx`, `Wordmark.jsx`.
Each references the CSS tokens above — copy the folder, link `cerios-theme.css`, import and use.

## The rules of the look

See `readme.md` — full content voice, visual foundations, iconography, and do's/don'ts.
Short version: sentence-case headlines, full-pill buttons with a → arrow, flat rounded cards
(no shadow), navy ↔ light ↔ green band rhythm, mint green reserved for CTAs and accents.

## Swap in your own assets

- **Font:** Figtree is a free stand-in for the site's proprietary face. Replace in `cerios-theme.css`.
- **Photos:** the demo uses Unsplash placeholders — swap for your own imagery.
- **Logo:** the Cerios looped-star mark is NOT included; the `Wordmark` renders "cerios" in type.
