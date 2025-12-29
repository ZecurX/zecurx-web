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

-   **Backgrounds**:
    -   Use `bg-background` for the main page background.
    -   Use `bg-muted` for secondary backgrounds (cards, sections).
    -   Use `bg-foreground` for primary buttons (text will be `text-background`).
-   **Text**:
    -   Use `text-foreground` for primary headings and body text.
    -   Use `text-muted-foreground` for subtitles and secondary text.
-   **Borders**:
    -   Use `border-border` for all borders.

**Why?**
These variables automatically switch values based on the active theme (`light` or `dark`). Using them guarantees your new pages (Services, Resources, etc.) will look perfect in both modes immediately.

### 2. Assets & Images

-   **Theme-Aware Images**:
    -   If a section requires a specific background image (like the Hero "glow"), use the pattern in `HeroSection.tsx`.
    -   Check `theme === "light"` to conditional render `/assets/light-bg.png` vs `/assets/dark-bg.png`.
-   **Logos**:
    -   Do **NOT** use `invert` filters on logos unless absolutely necessary.
    -   The current logo setup is optimized to look good on both light (white) and dark (black) backgrounds without modification.

### 3. Reusable Components (STRICT REUSE POLICY)

**Do NOT create new UI components if an equivalent already exists.**
We want to maintain a unified codebase. Reusing components ensures that design updates (like the recent Light Mode overhaul) propagate everywhere instantly.

-   **`ThemeToggle`**: Use `<ThemeToggle />` for any color mode switching.
-   **`CreativeNavBar`**: The single source of truth for navigation.
-   **`Footer`**: Use the shared footer component.
-   **UI Primitives**: Always import from `@/components/ui/` (Buttons, Cards, etc.).

### 4. Content Source (IMPORTANT)

All text, copy, and structural outlines for new pages are stored in the **`doc/` folder**.

-   **DO NOT write placeholder text (Lorem Ipsum).**
-   **DO NOT invent new copy.**
-   **ALWAYS** refer to the corresponding markdown file in `doc/` for the page you are building.
    -   Example: If building `/services`, read `doc/services.md` (or similar) first.
    -   Example: If building `/resources`, check `doc/resource.md`.

### 5. Upcoming Pages Roadmap

You are assigned to develop the following pages. Create new routes in `src/app/` for each (e.g., `src/app/services/page.tsx`).

-   **Services Page** (`/services`): Detailed breakdown of cybersecurity offerings.
-   **Why ZecurX** (`/why-zecurx`): Company values, mission, and differentiators.
-   **Resources** (`/resources`): Blog, whitepapers, and guides.
-   **Academy** (`/academy`): Educational platform landing.

**Objective**: Extend the "Cyber-Physical Obsidian" aesthetic (and its Light Mode equivalent) to these new pages. Maintain the high standard of animation and polish seen on the Landing Page.
