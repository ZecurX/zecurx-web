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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
