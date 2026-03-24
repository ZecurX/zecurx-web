# ZecurX Web

This is a [Next.js](https://nextjs.org) project implementing the ZecurX design from Figma.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Implements the ZecurX landing page design.
- Uses Tailwind CSS for styling.
- Uses `Manrope` and `Inter` fonts via `next/font/google`.
- Responsive design (based on Figma constraints).

## Project Structure

- `src/components/DarkMode.tsx`: The main component containing the Figma design implementation.
- `src/app/page.tsx`: The main page rendering the `DarkMode` component.
- `src/app/layout.tsx`: Root layout with font configurations.
- `src/app/globals.css`: Global styles and Tailwind configuration.

## Developers Guide (For Antigravity Agents)

This project has been set up with a **strict global theming system** to support both Light and Dark modes seamlessly. All future development MUST adhere to these guidelines to ensure consistency.

### 1. Theming & Styling Rules (CRITICAL)

**DO NOT** use hardcoded colors like `bg-black`, `bg-white`, `text-white`, or `text-black`.
Instead, use the semantic variables defined in `src/app/globals.css`.

- **Backgrounds**:
  - Use `bg-background` for the main page background.
  - Use `bg-muted` for secondary backgrounds (cards, sections).
  - Use `bg-foreground` for primary buttons (text will be `text-background`).
- **Text**:
  - Use `text-foreground` for primary headings and body text.
  - Use `text-muted-foreground` for subtitles and secondary text.
- **Borders**:
  - Use `border-border` for all borders.

**Why?**
These variables automatically switch values based on the active theme (`light` or `dark`). Using them guarantees your new pages (Services, Resources, etc.) will look perfect in both modes immediately.

# ZecurX Web

A Next.js website implementing the ZecurX design system and landing experience.

## Quick Start

Prerequisites: Node 18+, npm/yarn/pnpm

Install dependencies:

```bash
npm install
# or
pnpm install
```

Run development server:

```bash
npm run dev
```

Build and run production preview:

```bash
npm run build
npm run start
```

Open http://localhost:3000 to view the site.

## Useful Scripts

- `dev` — Runs Next.js in development mode.
- `build` — Builds the production app.
- `start` — Runs the production server.
- `lint` — Runs ESLint.
- `format` — Runs code formatter (if configured).

Check `package.json` for exact script names.

## Project Highlights

- Next.js with App Router (`src/app`).
- Tailwind CSS for utility-based styling.
- Theme-aware design system to support Light/Dark modes.

## Project Layout (high level)

- `src/app` — Next.js app routes and layouts.
- `src/components` — Reusable UI components.
- `scripts` — Helper and migration scripts used by the team.
- `docs` — Design & security docs (whitepapers, RBAC guides).

## Theming & Development Notes

- Use semantic CSS variables in `src/app/globals.css` for colors (avoid hardcoded `bg-black`/`text-white`).
- Prefer existing UI primitives in `src/components/ui/` when possible.
- Follow the project's responsive and accessibility conventions when adding components.

## Documentation

See the `docs/` directory for security reports, RBAC guides, and media role documentation.

## Contributing

1. Fork and branch from `main`.
2. Run `npm install` and `npm run dev`.
3. Open a PR with a clear description and screenshots for visual changes.

## License

This repository contains company-owned code — check internal policies for contribution and licensing.

---

Maintainers: point to the team or internal contacts as needed.

For further edits, tell me what you'd like added or adjusted.
