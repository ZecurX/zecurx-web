import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        exo2: ['var(--font-exo2)', 'sans-serif'],
        // In the current Tailwind v4 CSS-first setup, additional font utilities
        // must be declared in the CSS entrypoint `@theme` block (or that CSS
        // must explicitly reference this config with `@config`).
      },
    },
  },
  plugins: [],
}

export default config
