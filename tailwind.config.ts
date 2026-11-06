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
        // Philippine flag tones, used with restraint
        ph: {
          blue: "#0038A8",
          blueDeep: "#002A80",
          red: "#CE1126",
          gold: "#FCD116",
          sky: "#E8EEFB",
        },
        ink: {
          DEFAULT: "#0F1B2D",
          soft: "#3B4759",
          muted: "#6B7688",
          faint: "#97A1B0",
        },
        line: "#E3E7EE",
        paper: "#F7F8FA",
        gma: {
          red: "#CE1126",
          blue: "#0038A8",
          dark: "#0B1E36",
          navy: "#13294B",
          gold: "#F59E0B",
          slate: "#475569",
          border: "#E2E8F0",
          light: "#F8FAFC",
        },
        brand: {
          blue: "#0038A8",
          secondary: "#1F5FD1",
          navy: "#0B1E36",
          slate: "#475569",
          border: "#E2E8F0",
          soft: "#F1F5F9",
          light: "#F8FAFC",
          govNavy: "#0B1E36",
          govBlue: "#0038A8",
          govCyan: "#0EA5E9",
        },
      },
      fontFamily: {
        headline: ["var(--font-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(15, 27, 45, 0.04)",
        soft: "0 1px 2px rgba(15, 27, 45, 0.04), 0 8px 24px -12px rgba(15, 27, 45, 0.12)",
        card: "0 4px 6px -1px rgba(11, 19, 43, 0.07), 0 2px 4px -2px rgba(11, 19, 43, 0.05)",
        elevated: "0 10px 15px -3px rgba(11, 19, 43, 0.1), 0 4px 6px -4px rgba(11, 19, 43, 0.05)",
        broadcast: "0 4px 20px -2px rgba(0, 75, 147, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
