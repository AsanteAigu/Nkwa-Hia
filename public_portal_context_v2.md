# Public Portal — Context & Feature Description

## Ghana Emergency Health Grid | Greater Accra Scope

## Implementation Status: v3.0 — Frontend Complete

---

## Overview

The **Public Portal** is the citizen-facing window of the Ghana Emergency Health Grid. It requires no account, no login, and no technical knowledge — it opens in any browser on any device and gives any person in Greater Accra an immediate, accurate answer to the most urgent question in a medical emergency: *"Where should I go right now?"*

It combines a **live hospital status map** powered by Google Maps that shows real-time bed availability across Greater Accra, and an **AI-powered emergency triage assistant** that accepts a plain-language (or voice) description of a person's condition and returns a clear hospital recommendation with directions and contact information.

No registration. No waiting. Open the page, describe what is happening, and get a direction.

---

## Implementation Notes (v3.0)

The frontend is implemented as a single-file React application (`ghana_mayo_redesign.html`). v3.0 is a full visual redesign of the v2.0 interface, inspired by the editorial medical aesthetic of Mayo Clinic's public website. All v2.0 functionality is preserved; this version updates the design system, page structure, and introduces light/dark mode switching.

### Technology Stack

* **Framework**: React 18 (via CDN, no build step required)
* **Styling**: Hand-crafted CSS with CSS variables — chosen for full control over the medical editorial aesthetic, optimal performance on low-bandwidth connections, and seamless light/dark mode switching via `data-theme` attribute
* **Map rendering**: **Google Maps JavaScript API** (introduced in v2.0, retained in v3.0)
* **AI triage**: Claude Sonnet 4 via the Anthropic `/v1/messages` API
* **Voice input**: Browser Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) with `en-GH` locale
* **Typography**: Libre Baskerville (serif — headings, titles, hero) + DM Sans (sans-serif — body, UI, labels)
* **Theme**: Dual-mode — light clinical white with navy/blue accents (default); dark deep-navy with adjusted palette (toggle)

### Design System — v3.0

The v3.0 visual identity is modelled on the Mayo Clinic editorial design language: clean structure, serif authority, generous whitespace, and a strong institutional blue.

**Brand colours:**
- Primary blue: `#006DB7` — used for interactive elements, CTAs, nav underlines, and brand identity
- Deep navy: `#1A2E44` — headings, hero background, footer
- Brand teal: `#00857C` — accent, retained from v2.0 for continuity
- Brand red: `#C8102E` — emergency calls to action (ambulance button, critical alerts)

**Light mode surfaces:**
- Page background: `#FFFFFF`
- Soft background: `#F7F8FA`
- Card background: `#FFFFFF`
- Borders: `#D6DDE6`

**Dark mode surfaces** (activated via `data-theme="dark"` on `<html>`):
- Page background: `#0E1621`
- Soft background: `#141E2D`
- Card background: `#1A2740`
- Borders: `#2A3D56`
- Primary blue adjusts to `#5AB4E8` for sufficient contrast on dark surfaces

**Status colours (v4.2 — updated palette):**
- Green / Available: dot `#2E7D32`, label `#1B5E20`, background `#E8F5E9`
- Yellow / Moderate: dot `#F9A825`, label `#7A5800`, background `#FFF8E1`
- Orange / Near Capacity: dot `#E65100`, label `#BF360C`, background `#FBE9E7`
- Red / Full: dot `#D32F2F`, label `#7F1C1C`, background `#FFEBEE`

All status colours have dark-mode variants that maintain WCAG AA contrast ratios.

**Typography pairing:**
- `Libre Baskerville` (serif) — all headings, hero titles, modal titles, result panel headers. Communicates medical authority and institutional trust.
- `DM Sans` (sans-serif) — all body copy, form labels, navigation, button text, metadata. Clean and legible at small sizes.

---

## Section 1: Light / Dark Mode

### Overview

v3.0 introduces a **system-level light/dark mode toggle** — a first for the portal. The toggle lives in the main navbar (moon icon → switches to dark; sun icon → switches to light).

### Implementation

- The `data-theme` attribute on the root `<html>` element switches between `"light"` (default) and `"dark"`
- All colour values are defined as CSS custom properties on `:root` (light) and `[data-theme="dark"]` (dark override)
- Transitions on `background` and `color` properties provide a smooth 0.3s crossfade between modes
- No JavaScript class manipulation — the single attribute change cascades through the entire design token system
- The toggle button uses a `useTheme` React hook that manages state and updates the DOM attribute

### What changes between modes

Every surface, border, text colour, shadow, status colour, map style, and interactive state has a dark variant. The Google Maps instance uses a light (`#f5f8fc` base) map style in light mode — dark map styling is planned for v3.1 via dynamic style injection on theme toggle.

---

## Section 2: Page Structure & Navigation

v3.0 introduces a full editorial page layout modelled on mayoclinic.org, replacing the single-scroll layout of v2.0.

### Utility Bar

A slim bar above the navbar (matching Mayo Clinic's top utility strip) contains:
- Quick navigation links: Hospital Map · AI Triage · All Hospitals
- Live status context: "Greater Accra · Live Status"
- **193 Ambulance** emergency shortcut button (brand red, always visible)

### Navbar

A sticky navbar sits below the utility bar with:
- **Brand logo** — cross icon + "Ghana Emergency Health Grid" in Libre Baskerville + "Greater Accra Public Portal" subtitle
- **Horizontal nav** — Hospital Map · AI Triage · All Hospitals · About, with active underline states matching the brand blue border
- **Theme toggle** — circular icon button (moon/sun)
- **193 Ambulance** CTA button (brand blue, always visible)

The navbar has a 2px brand-blue bottom border — a direct reference to Mayo Clinic's distinctive navbar styling.

### Hero Section

A full-width dark hero section with:
- **Radial gradient atmospheric lighting** in blues and teals
- **Subtle grid-line texture** overlay (60×60px, 6% opacity)
- **Live badge** with animated green pulse dot
- **Two-column layout**: editorial headline + live status panel
- **Hero CTA pair**: "AI Emergency Triage" (white button) + "View Hospital Map" (ghost button)
- **Stats panel** (right column): 2×2 grid of facility counts by status tier, plus a mini list of the first 5 hospitals with status badges — all in a glassmorphism card

### Feature Strip

Three editorial cards below the hero introducing the portal's core capabilities (AI Triage · Live Map · No Registration). Each card has an animated top-border reveal on hover — a Mayo Clinic pattern.

### Sections

| Section | Anchor | Background |
|---|---|---|
| Hospital Map | `#map` | Soft (`--bg-soft`) |
| All Hospitals (card grid) | `#hospitals` | White (`--bg`) |
| AI Triage | `#triage` | White (`--bg`) |
| Results | inline | Soft (`--bg-soft`) |

### Footer

Four-column footer on a deep navy background with brand text, quick links, hospital shortcuts, and emergency numbers (193 · 112 · 191 · 192).

---

## Section 3: The Live Hospital Map

### Map Styling — v3.0

The Google Maps instance now uses a **light map style** in v3.0, matching the clinical white design system:
- Background / land: `#f5f8fc`
- Roads: `#ffffff` primary / `#dde8f4` highways
- Road strokes: `#d6dde6` / `#b8cfe0`
- Water: `#c5dff0`
- POI / parks: `#e8f0e8`
- Labels: `#4a6080`

This replaces the dark map style from v2.0, which matched the previous dark-only interface.

### Hospital Markers — v3.0

Markers are redesigned as **teardrop / location pin SVGs** (replacing the circle-and-dot design from v2.0):
- White outer teardrop with a drop shadow coloured in the hospital's status dot colour
- Filled teardrop interior in the status dot colour
- White medical cross cutout inside the pin
- Stale data amber dot in the top-right corner if data is over 4 hours old
- Anchor point: bottom tip of the pin

### Hospital Modal

In v3.0, clicking a map marker or a hospital card opens a **centred modal dialog** (replacing the bottom-sheet / side-panel pattern from v2.0). The modal:
- Appears over a blurred, darkened backdrop
- Animates in with a spring `cubic-bezier(0.34,1.56,0.64,1)` entrance
- Has a 4px coloured accent bar at the top in the hospital's status colour
- Contains all hospital detail (status, beds, wards, oxygen, distance, timestamp, phone)
- Closes on backdrop click or the × button
- Has two footer actions: **Get Directions** (ghost) + **Use for Triage** (primary, Green/Yellow only)

### Hospital Card Grid

A new **card grid section** (`#hospitals`) displays all hospitals as scannable cards below the map. Each card shows:
- 4px status colour top bar
- Hospital name (Libre Baskerville), type badge
- Status badge with dot
- Bed count chips per ward
- Oxygen / distance / last-updated metadata row
- Stale data strip at card bottom if applicable
- **Directions** + **Details** action buttons

This grid did not exist in v2.0; it replaces the map as the primary browsing surface for users who want to scan all facilities.

### Map Controls — unchanged from v2.0

Located in the map toolbar (above the map canvas, never overlaying it):
- Status count summary (Green / Yellow / Orange / Red counts)
- Near Me button
- Ward filter dropdown
- AI Triage shortcut

---

## Section 4: The AI Emergency Triage Input

All triage functionality is unchanged from v2.0. The form is presented in a **two-column layout** in v3.0: an editorial introduction panel on the left (sticky on desktop) and the form card on the right.

### Triage Form Card

The form is wrapped in a card with a **brand-blue header bar** (replacing the plain section heading from v2.0), containing the title "Emergency Triage Assistant" and a subtitle.

### Voice Input — unchanged from v2.0

- Web Speech API with `en-GH` locale
- Continuous recognition with interim results
- Transcribed text appended to textarea in real time
- Recording state shown with animated red pulse dot
- Graceful fallback to manual typing if unsupported

### Input Fields — unchanged from v2.0

1. Emergency Description (Required) — textarea with voice toolbar
2. Condition Type Tags (Optional) — 8 quick-tap pills
3. Patient Age Group (Optional) — 4-card grid
4. Location (Optional) — text input + GPS button

### Results Panel — v3.0 layout changes

The result panel is structurally identical to v2.0 but restyled:
- **Blue header bar** with result title, confidence pill, and urgency label
- **Side-by-side recommendation cards** (primary left / backup right) on desktop, stacked on mobile
- Primary card has a coloured accent line in the hospital's status colour
- Loading state uses a **shimmer progress bar** and step-by-step loading list

---

## Section 5: Accessibility & Design Principles

### Light Mode — Clinical Priority

The default light mode prioritises maximum legibility and trust. White backgrounds with high-contrast navy text meet WCAG AA for all body text and AAA for headings. The institutional blue palette signals authority without alarm.

### Dark Mode — Low-Light Usability

The dark mode is designed for night use and OLED battery saving. All status colours are lightened for sufficient contrast on dark surfaces. The deep navy palette reduces eye strain in low-light environments (ambulances, night-time emergencies).

### Mobile-First Design — unchanged from v2.0

- Minimum 44×44px tap targets
- Single-column layout on mobile (≤640px for most breakpoints, ≤900px for two-column sections)
- Hospital modal replaces bottom-sheet on all screen sizes
- Hospital card grid wraps to single column on narrow viewports

### Incremental Updates (v4.1.0)
- **Triage UI Redesign**: Implemented a complete 1:1 structural overhaul of the `TriageForm` to match a bespoke medical dark-mode aesthetic.
- **Custom Severity Scale**: Introduced a 5-segment interactive Severity Scale. This captures a discrete `1-5` integer value that is directly wired into the Anthropic payload for deterministic routing.
- **Header Split**: Refactored the "Ask AI Agent" button into a pill-shaped header component containing a custom `@keyframes` CSS animation (`pulse-green`).

### Incremental Updates (v4.0.0)

- **AI Triage Chatbot Workflow**: Entirely restructured the static `TriageForm` text box into a conversational flow. Added an `AI Triage Assistant` launcher that injects a `ChatModal` via strict React state (`chatOpen`). This Modal preserves conversation history, actively sending an array of JSON objects (`{role: 'user'|'assistant'}`) to Claude 3.5 Sonnet to construct a highly dynamic emergency first-aid guide.
- **Dynamic Anthropic Tooling**: The Anthropic System Prompt was completely rewritten to expect conversational context. The AI is now instructed to dynamically query for missing demographics (e.g., patient age) by triggering `isMoreInfoNeeded: true`, before finally outputting `firstAidGuide` structural text strings formatted natively into the user interface.
- **Heatmap Interaction Hooks**: Upgraded the Visualization Heatmap Layer to a default loaded state (`showHeatmap: true`) and bound an underlying Euclidean distance calculation function to the root `gmapRef`. This essentially grants the Heatmap "Click-to-Detail" pseudo-interactivity (locating the nearest coordinate vector underneath the blurred map pixel and rendering its standard Hospital Modal).

### Incremental Updates (v4.3)

- **Per-Status Heatmap Layers**: Replaced the single shared `HeatmapLayer` (which rendered all hospitals in the same default green gradient) with four independent `HeatmapLayer` instances — one per capacity status group. Each layer receives only the coordinates of hospitals belonging to its status, and uses a dedicated 4-stop colour gradient tuned to the exact brand palette:
  - Available → transparent → `#2E7D32` (green)
  - Moderate → transparent → `#F9A825` (yellow)
  - Near Capacity → transparent → `#E65100` (orange)
  - Full → transparent → `#D32F2F` (red)
  All four layers render simultaneously at `radius: 42` (mobile: 28), `opacity: 0.8`, and `maxIntensity: 4`. When the ward filter changes, each layer's data is updated independently so only hospitals matching the selected ward are shown. When the Strain Heatmap toggle is switched off, all four layers are hidden atomically.
- **Triage UI Light Mode Nativization**: Stripped explicitly hardcoded graphite colour properties (e.g. `#2A2A2A`, `#333333`) from the `[data-theme="light"]` selector block for the `.triage-v2-card`. The main Triage Component and its child interactive elements (Chips, Location Input, Age Options) now correctly fall back to dynamically rendering global CSS design tokens (`var(--surface)`, `var(--bg-card)`, `var(--border)`). This resolves a visual bug where the hero card remained explicitly forced into a Dark Mode appearance ignoring the user's active Light Mode theme context.
- **AI Agent Identity (Dr. Joel)**: Rebranded the conversational AI Triage Agent from the placeholder "Claude" to "Dr. Joel" throughout the chat header and the introductory welcome message to provide a more relatable and professional clinical persona for users in distress.
- **Triage Banner Responsiveness**: Refactored the `.claude-emergency-bar` and `.claude-call-btn` styles to handle narrow viewports better. On devices smaller than 480px, the red emergency banner now stacks vertically with a `100%` width "Call 193" button, preventing text wrapping inside the button and ensuring an accessible touch target during critical moments.
- **Scroll Lock UX**: Integrated a global `useEffect` hook in the root `App` component to manage `document.body.style.overflow`. When a Hospital Modal or the AI Triage chat is active, the main page background is locked (`overflow: hidden`), forcing all scroll events to stay within the active modal panel.
- **Map Fullscreen Exit Control**: Introduced a custom "EXIT FULLSCREEN" action button (solid red, high contrast) that dynamically renders in the top-right corner of the map only when the browser's Fullscreen API is active. This provides a fail-safe exit route for users on mobile devices where native browser exit controls might be obscured.
- **Google Maps Deep Link Navigation**: Replaced all DirectionsService, DirectionsRenderer, TrafficLayer, and simulation code with the standard, production-grade approach used by apps worldwide. The "Get Directions" button in every Hospital Modal and Triage result now constructs a Google Maps deep link in the format `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}&travelmode=driving`. On mobile this directly launches the native Google Maps (or Apple Maps on iOS) with the destination pre-loaded and navigation ready to start. On desktop it opens Google Maps in a new tab with the full route.
- **Interface Simplification**: Completely removed the legacy hospital cards grid and associated list-based discovery. The portal now relies exclusively on the interactive heatmap and markers for discovery, providing a more focused and medical-grade user experience.



### Incremental Updates (v3.0.1)

- **Hospital Strain Heatmap**: Integrated the Google Maps `visualization` library to enable a dynamic "Strain Heatmap" toggle on the map canvas. When activated, the standard map markers dissolve and are replaced by a weighted intensity heatmap calculating regional bed availability constraints (Red status hospitals project heavy weight thresholds of 12, whereas Green project 1). This allows citizens to instantly visualize overwhelmed geographic zones and physically route away from saturated areas.
- **Global Mobile Layout**: Implemented rigid CSS guards (`max-width: 100vw; overflow-x: hidden;`) on the root body element, paired with aggressive word breaking to prevent long text grids or un-wrapped flex rows from blowing out the viewport width and triggering horizontal scrolls on narrower devices (e.g. iPhone SE at 320px).
- **Navigation Redesign**: Promoted the "193 Ambulance" call button to a dedicated full-width red banner anchoring the very top of the mobile screen (`.utility-bar`), removing it from the congested main navbar to improve the visual hierarchy of the brand logomark and dark mode controls.
- **Theme Readability**: Hardcoded the primary CTA button text and icon colours out of the dynamic `var(--brand-navy)` token (which swaps to near-white in Dark Mode) and into an absolute dark shade (`#1A2E44`), guaranteeing WCAG visibility against the button's static white background regardless of the selected theme logic.
- **React 18 Strict Mode Rendering**: Restructured the Google Maps initialization `useEffect` to safely poll the DOM and prevent double-injection of the script callback, averting fatal duplicate DOM API re-initializations while continuing to gracefully error with a locked grey map block when restricted API keys face `InvalidKeyMapError` rejection from Google's servers.

### No Barriers to Access — unchanged

- No login, no account, no registration
- No app download required
- Single-file delivery
- Works without GPS
- Voice input falls back to typing

---

## Section 6: Component Architecture

| Component | Responsibility |
|---|---|
| `App` | Root state, theme management, API orchestration, modal control |
| `useTheme` | Hook — manages `theme` state, updates `data-theme` on `<html>` |
| `Navbar` | Sticky nav with brand, horizontal nav links, theme toggle, 193 CTA |
| `MapView` | Google Maps init (light style), marker rendering, Near Me, ward filter |
| `HospitalModal` | Centred dialog — full hospital details, directions, triage CTA |
| `HospitalCardsGrid` | Scannable card grid of all hospitals with status, beds, and actions |
| `TriageForm` | Triage input form — description, voice, tags, age, location, submit |
| `useVoice` | Hook — Web Speech API recording, transcript injection |
| `ResultPanel` | Loading shimmer + recommendation cards |
| `RecBlock` | Individual recommendation card (primary or backup) |
| `LoadingPanel` | Shimmer progress bar + animated step list |

App-level state:
- `theme` — `'light'` | `'dark'`
- `selectedHospital` — hospital object | `null`
- `modalOpen` — boolean
- `result` — triage result object | `null`
- `loading` — boolean

---

## Section 7: What This Portal Is Not

- It is **not a 193/ambulance replacement**. It does not dispatch ambulances, alert hospitals, or create clinical records.
- It is **not a diagnostic tool**. The AI matches a description to available capacity; it does not diagnose.
- It is **not a guaranteed bed reservation**. The "call ahead" links exist precisely for this reason.
- It is **not gated by specialist access**. Any citizen can use it.

---

## Section 8: Integration Roadmap

| Item | Status |
|---|---|
| Google Maps integration | ✅ Complete (v2.0) |
| Light map style (clinical white) | ✅ Complete (v3.0) |
| SVG teardrop hospital markers with cross | ✅ Complete (v3.0) |
| Centred modal dialog for hospital details | ✅ Complete (v3.0) |
| Hospital card grid section | ✅ Complete (v3.0) |
| Light / dark mode toggle | ✅ Complete (v3.0) |
| Utility bar + full navbar | ✅ Complete (v3.0) |
| Editorial hero with stats panel | ✅ Complete (v3.0) |
| Feature strip (3-card editorial row) | ✅ Complete (v3.0) |
| Four-column footer | ✅ Complete (v3.0) |
| Libre Baskerville + DM Sans typography | ✅ Complete (v3.0) |
| Tap-to-reveal status tooltip | ✅ Complete (v2.0) |
| Near Me / GPS | ✅ Complete |
| Ward filter | ✅ Complete |
| Stale data indicator | ✅ Complete |
| Voice input (Web Speech API) | ✅ Complete (v2.0) |
| AI triage form | ✅ Complete |
| Recommendation result panel | ✅ Complete |
| Confidence / urgency display | ✅ Complete |
| Ambulance alert logic | ✅ Complete |
| Dark map style on dark mode toggle | 🔲 Planned (v3.1) |
| Live hospital capacity API | 🔲 Requires Hospital Portal backend |
| Google Distance Matrix for real travel times | 🔲 Planned (v3.1) |
| Twi language toggle | 🔲 Planned (v4) |
| Offline / PWA support | 🔲 Planned (v4) |

---

## Summary

v3.0 is a complete visual redesign of the Public Portal, reframed around the editorial medical aesthetic of institutions like Mayo Clinic — clean white surfaces, serif authority, strong typographic hierarchy, and a trustworthy institutional blue. The interface now has a proper page structure (utility bar, sticky navbar, hero, feature strip, map section, hospital grid, triage form, footer) rather than a single-scroll layout. Light and dark modes are fully supported with a single toggle, adapting every colour token, shadow, and surface across the entire interface. All v2.0 functionality — Google Maps, AI triage, voice input, GPS, ward filter, stale data indicators, ambulance alerts — is preserved unchanged. The portal remains what it has always been: a **public utility**, open to every citizen, designed for the worst moment of a person's life.

