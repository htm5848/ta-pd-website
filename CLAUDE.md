# Physics TA Hub — CLAUDE.md

Project context and conventions for AI-assisted development.

---

## Project Overview

A single-page web app for UIUC Physics TAs (PHYS 211). It helps TAs log teaching sessions, access course materials, track grading, and communicate with coordinators. Researchers can also use an observation mode.

**Live site:** `https://htm5848.github.io/ta-pd-website/`
**GitHub repo:** `https://github.com/htm5848/ta-pd-website`

---

## File Structure

```
website/
├── index.html        # All HTML — page shells, navigation, modals
├── css/
│   └── styles.css    # All styles — design tokens, layout, components
├── js/
│   └── main.js       # All JavaScript — data, rendering, navigation
└── .gitignore
```

There is no build step, no framework, no package manager. Everything is plain HTML/CSS/JS. Changes to any file take effect immediately after pushing to GitHub (GitHub Pages updates in ~1 min).

---

## Design System

### Color Tokens (defined in `css/styles.css` under `:root`)

| Token | Hex | Used for |
|---|---|---|
| `--orange` | `#E84A00` | Primary action, UIUC brand |
| `--orange-lt` | `#FFF0EA` | Orange backgrounds |
| `--orange-md` | `#FFD4C0` | Orange borders |
| `--blue` | `#13294B` | UIUC navy, sidebar, headers |
| `--blue-lt` | `#E8EEF6` | Blue backgrounds |
| `--blue-md` | `#C2D0E4` | Blue borders |
| `--sand` | `#F5F3EE` | Page background |
| `--sand-2` | `#EAE7E0` | Card borders, dividers |
| `--sand-3` | `#D8D4CB` | Hover borders |
| `--white` | `#FFFFFF` | Card backgrounds |
| `--ink` | `#1A1814` | Primary text |
| `--ink-2` | `#4A4740` | Secondary text |
| `--ink-3` | `#8A877E` | Muted/placeholder text |
| `--green` | `#1A6B3C` | Success, positive states |
| `--green-lt` | `#E8F5EE` | Green backgrounds |
| `--purple` | `#5B3FA6` | Accent (modules) |
| `--purple-lt` | `#F0ECFC` | Purple backgrounds |
| `--teal` | `#0B6E6E` | Accent (comms) |
| `--teal-lt` | `#E6F4F4` | Teal backgrounds |

### Typography

| Token | Value |
|---|---|
| `--sans` | `'Inter', sans-serif` |
| `--mono` | `'DM Mono', monospace` |

- Body text: 13–14px, `--sans`
- Labels/tags: 10–11px, `--mono`
- Page headings: 26px, font-weight 700
- Card titles: 13–15px, font-weight 600

### Spacing & Shape

- `--radius`: `12px` (cards)
- `--radius-sm`: `8px` (buttons, inputs)
- `--shadow`: subtle card shadow
- `--shadow-md`: hover card shadow

---

## Pages

All pages live inside `index.html` as `<div class="page hidden" id="page-*">`. Only one is visible at a time. Navigation is handled by `showPage(id)` in `main.js`.

| Page ID | Nav label | Description |
|---|---|---|
| `dashboard` | Dashboard | Welcome banner, reminders, quick-access module cards |
| `grading` | Grading | Table of assignments with status badges and progress bars |
| `materials` | Materials | Illinois Box week folders and file cards |
| `teaching` | Teaching Log | 2-column layout: main content + 320px sidebar |
| `comms` | Coordinator | Message thread + supply request form |
| `firstta` | First Time TA | 10 PD modules with completion tracking |
| `observation` | Observation | Researcher-only classroom observation tools |

---

## Teaching Log Layout

**Layout:** CSS grid — `1fr 320px` (main column + sidebar)

**Main column (left):**
- "What was challenging this session?" — textarea, orange accent
- "What went well this session?" — textarea, green accent
- AristAI recommendations link card (dark blue)

**Sidebar (right):**
- Semester insights stat cards (Sessions logged, Avg rating, Highest dimension, Needs attention)
- Session ratings — Likert scale, 5 dimensions, 1–5
- Table snapshot — quick per-table rating grid

**Likert dimensions** (defined in `LIKERT_ITEMS` in `main.js`):
- Student engagement
- Student participation
- My own confidence
- Preparedness for class
- Overall session quality

---

## Roles & Admin

Four roles in the sidebar role switcher. Three switch freely; Admin requires a password.

| Role | How to switch | User shown |
|---|---|---|
| TA | Click | Your Name · TA · Discussion 3 |
| Coord | Click | Tim Stelzer · Discussion Coordinator |
| Admin | Password modal | Prof. Zhang · Admin · PHYS 211 |
| Research | Click | Researcher · PHYS 211 (also reveals Observation nav) |

**Admin password** is stored in `js/main.js` at the top of the admin section:
```js
const ADMIN_PASSWORD = "Admin@PHYS211";
```
Change this string to update the password, then push.

> This is client-side only — the password is visible in the source. Sufficient for basic access control on an academic site, not for sensitive data.

---

## Observation Tools (Researcher role only)

8 research tools, rendered as a grid by `renderResearchToolGrid()`. Each has its own panel shown by `showResearchTool(id)`.

| ID | Tool | Export |
|---|---|---|
| 1 | Talking & Listening | — |
| 2 | Whiteboard Usage | CSV |
| 3 | TA Position Map | CSV |
| 4 | Question Type Logger | CSV |
| 5 | Group Dynamics Coder | CSV |
| 6 | Student-TA Interactions | CSV |
| 7 | Physics Reasoning | CSV |
| 8 | Time-on-Task Sweep | CSV |

---

## Key JavaScript Functions

| Function | File | What it does |
|---|---|---|
| `showPage(id)` | main.js | Switch visible page, update topbar title |
| `setRole(r)` | main.js | Switch user role, update sidebar profile |
| `showAdminLogin()` | main.js | Show admin password modal |
| `submitAdminLogin()` | main.js | Validate password, unlock admin role |
| `renderLikert()` | main.js | Build Likert rating rows from `LIKERT_ITEMS` |
| `renderTableSnapshot()` | main.js | Build per-table rating cards |
| `renderWeekGrid()` | main.js | Render Illinois Box week folder cards |
| `renderTAModules()` | main.js | Render First Time TA module cards |
| `renderResearchToolGrid()` | main.js | Render observation tool grid |
| `saveLog()` | main.js | Validate and save teaching log |
| `sendMsg()` | main.js | Add message to comms thread |

---

## How to Make Changes

1. Edit `index.html`, `css/styles.css`, or `js/main.js` in VS Code
2. Open Terminal and run:
```bash
cd "/Users/hamidehtalafian/Library/CloudStorage/OneDrive-Personal/projects/TA PD/website"
git add index.html css/styles.css js/main.js
git commit -m "describe what changed"
git push
```
3. Site updates at `https://htm5848.github.io/ta-pd-website/` within ~1 minute.

---

## Git History

| Commit | What changed |
|---|---|
| `52a01a7` | Admin login modal with password protection |
| `ab55b2d` | Split index.html into css/styles.css and js/main.js |
| `afd4896` | Move reflection prompts to main column, ratings to sidebar |
| `ca8fc0e` | Initial commit: Physics TA Hub website |

---

## Things to Keep in Mind

- **No build step** — edits go directly into the files, no compilation needed.
- **Single page app** — all pages are in one HTML file, shown/hidden via JS.
- **No backend** — all data is in-memory only; nothing persists across page refreshes.
- **Inline styles** — most component styles are written inline in HTML/JS template strings, not in `styles.css`. Only structural/global styles are in the CSS file.
- **Illinois Box integration** — Materials page uses hardcoded Box folder IDs. To add weeks, update `BOX_WEEKS` array in `main.js`.
- **AristAI link** — hardcoded URL in Teaching Log and sidebar. Update in `index.html` if the URL changes.
