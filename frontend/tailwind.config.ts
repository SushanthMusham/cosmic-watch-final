import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: "#0B0E17", // Deep Void
          800: "#151B2E", // Nebular Blue
          700: "#232D4B", // Starlight
        },
        accent: {
          cyan: "#00F0FF", // HUD Cyan
          red: "#FF2E2E", // Danger/Risk
          gold: "#FFD700", // Warning
        },
      },
      backgroundImage: {
        "stars": "radial-gradient(circle, #ffffff 1px, transparent 1px)",
        "nebula": "linear-gradient(to bottom right, #0B0E17 0%, #151B2E 100%)",
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
      }
    },
  },
  plugins: [],
};
export default config;