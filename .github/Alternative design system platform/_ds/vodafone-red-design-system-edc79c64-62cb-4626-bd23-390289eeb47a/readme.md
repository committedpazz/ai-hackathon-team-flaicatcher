# Vodafone Red — Design System

An inspired interpretation of Vodafone's marketing design language: a telecom super-brand whose surface alternates between editorial photography hero bands carrying colossal uppercase display headlines and calmer white content bands, anchored by the signature scarlet red CTA pill and the speechmark orb.

> **Sources.** This system was built from a written brand-analysis specification (colors, type scale, radius/spacing tokens, and component definitions) provided by the user. No Vodafone codebase or Figma file was attached — there is no upstream design source to link. This is a demonstration / prototyping system and is **not affiliated with Vodafone Group**.

> **Font substitution.** The Vodafone display sans is proprietary. This system substitutes **Inter** (weights 300/400/500/600/700/800) loaded from Google Fonts — the spec's recommended closest free match. At hero scale, Inter 800 + `letter-spacing: -1px` reproduces the heavy stencil look. **If you have the real Vodafone webfonts, drop them into `tokens/` and swap the `@import` in `tokens/fonts.css` for `@font-face` rules.**

---

## Index (root manifest)

| Path | What it is |
|---|---|
| `styles.css` | Global entry point — `@import`s only. Consumers link this one file. |
| `tokens/fonts.css` | Webfont loading (Inter substitute). |
| `tokens/colors.css` | Color custom properties + semantic aliases. |
| `tokens/typography.css` | Font family, weights, type-role sizes/leading/tracking. |
| `tokens/spacing.css` | 4px-based spacing scale. |
| `tokens/radius.css` | Radius scale (pills + 6px cards). |
| `tokens/base.css` | Reset + `.vf-*` type-role utility classes. |
| `components/core/` | Button, IconButton, Input, Badge, Card. |
| `components/navigation/` | NavBar. |
| `components/brand/` | SpeechmarkOrb. |
| `foundations/` | Specimen cards for the Design System tab (Type, Colors, Spacing, Brand). |
| `ui_kits/marketing/` | Interactive marketing homepage recreation. |
| `assets/` | Speechmark orb SVG + placeholder photography. |
| `SKILL.md` | Agent-Skill entry point for downstream use. |

### Components
- **Button** (`components/core`) — pill CTA; `primary` / `outline-red` / `outline-dark` / `outline-on-dark`; sizes sm/md/lg.
- **IconButton** (`components/core`) — circular white icon button.
- **Input** (`components/core`) — text input with label/hint/invalid.
- **Badge** (`components/core`) — inline category chip.
- **Card** (`components/core`) — story card with 16:9 thumbnail + headline + caption.
- **NavBar** (`components/navigation`) — dark top nav with orb + links.
- **SpeechmarkOrb** (`components/brand`) — the brand's signature anchor mark.

### UI kits
- **Marketing** (`ui_kits/marketing`) — hero → story band → red CTA → footer, with working search + account overlays.

---

## Content fundamentals

**Voice: confident, plain-spoken, optimistic.** Copy reads like a campaign poster, not a corporate site. The hero is a two-or-three-word command in the brand's stencil voice (`STAY CONNECTED`, `READY WHEN YOU ARE`); the supporting sentence beneath is a calm, complete, benefit-led statement ("Our biggest network upgrade yet brings faster 5G to more places than ever.").

- **Person.** Second person, "you / your" — the network is framed around the customer ("a network built for everyone", "coverage that keeps up with **you**"). The brand speaks as "we / Vodafone" sparingly.
- **Casing.** Hero display headlines are **UPPERCASE**. Everything else — sub-displays, card titles, body — is **sentence case**. Eyebrows are uppercase but small.
- **Length.** Headlines are terse (1–4 words at hero scale). Body sentences are short and concrete; avoid jargon.
- **Numbers & offers.** Prices and terms are stated plainly in `caption-strong` ("£25 a month for 24 months") with fine print in `caption`.
- **Emoji.** Never. The brand has no emoji in its marketing voice.
- **Vibe.** Aspirational but grounded — "the future is exciting, ready?" energy. Confident, never shouty in the body copy; the shout lives entirely in the display type.

---

## Visual foundations

- **Color.** One accent only — **Vodafone Red `#e60000`** — reserved for primary CTAs and the speechmark orb. Everything else is **ink `#25282b`**, white, and a small grayscale ramp (`#7e7e7e` body, `#bebebe` mute, `#f2f2f2` soft surface). No second accent, no semantic palette on the marketing surface (red doubles as error when needed).
- **Type.** A single family carries the whole system. **Weight 800 + uppercase + `-1px` tracking = the hero voice**; **weight 300 at 40–48px = the calm secondary voice**. Body is weight 400 with neutral tracking. The contrast between 800 and 300 *is* the typographic story.
- **Spacing.** 4px base unit; bands use 32px gutters; cards pad at 16px; inline gaps at 12px.
- **Backgrounds.** Full-bleed **editorial photography** in the dark hero (real portraits/cities/cabling) at reduced opacity over ink — the only atmospheric effect. No gradients, no illustration, no texture/pattern. Content bands are flat white.
- **Animation.** Minimal and quick. Hover = subtle `brightness()` shift on buttons / `opacity` lift on links (~150ms ease). No bounces, no decorative looping motion, no parallax. Slide/entrance motion is not part of the marketing system.
- **Hover states.** Buttons darken slightly (`brightness(0.92)`); nav links go from 90% → 100% opacity. **Press states** are not exaggerated — no shrink/scale.
- **Borders.** Hairlines only: 1px solid ink on inputs/outline buttons; 1px white @ 25% opacity as `divider-on-dark`. Outline buttons on dark use a 1px white border.
- **Shadows.** **None.** Depth comes from polarity-flip between ink and canvas bands, never drop shadows.
- **Transparency / blur.** Hero photo sits at ~55% opacity over ink; overlays (search/account) use an ink scrim at 60–85% alpha. No backdrop blur.
- **Imagery color vibe.** Real, full-colour editorial photography — neither heavily warm nor cool, no grain or duotone. Cropped tight (an eye line, a phone hand) at small breakpoints.
- **Corner radii.** Interactive shapes are pills (60px CTAs, 32px chips, 9999px icon circles). Cards and images are a gentle **6px**. Bands/footers are square (0px).
- **Cards.** Flat — 6px radius, 16px padding, no shadow, optional 1px hairline; a 16:9 thumbnail on top, then badge → headline → caption hugging close.
- **Layout.** Wide, near edge-to-edge with 32px gutters; story grids 2–3 up collapsing to 1-up on mobile; nav sticky at the top.

---

## Iconography

- **No bespoke icon set was provided.** The spec references a proprietary `icomoon` icon font that is not available here.
- **Substitute:** UI glyphs (search, close, chevron, play) are drawn inline as **Lucide-style** stroke icons (2px stroke, rounded) in the UI kit, matching the brand's clean line vocabulary. If you adopt a CDN set, **Lucide** is the closest match — flag any swap.
- **The speechmark orb** is the one true brand mark — `assets/speechmark-orb.svg` and the `SpeechmarkOrb` component (inline SVG). It is a stylized generic quotation-curl glyph in a red 6px-radius square, **not** a reproduction of the Vodafone trademark lockup. Never substitute it with a wordmark or different shape; never render below ~48px.
- **No emoji, no unicode glyphs** used as icons anywhere.
- **Assets present:** `assets/speechmark-orb.svg`; `assets/placeholder-*.png` (brand-toned stand-in photography — replace with real imagery).

---

## Do's and Don'ts

**Do** — reserve red for CTAs + the orb · set heroes in weight-800 uppercase with `-1px` tracking · use 60px pills on every button · cycle ink → canvas → ink bands · pair portrait photography with the headline overlay.

**Don't** — introduce a second accent colour · render hero headlines in sentence case · use square-cornered CTAs · drop shadows on cards · substitute the orb · set 144px display at `0` tracking.
