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
        gma: {
          red: "#D90429",
          blue: "#004B93",
          dark: "#0B132B",
          navy: "#1C2541",
          gold: "#FFB703",
          slate: "#475569",
          border: "#E2E8F0",
          light: "#F8FAFC",
        },
        brand: {
          blue: "#004B93",
          secondary: "#0284C7",
          navy: "#0B132B",
          slate: "#475569",
          border: "#E2E8F0",
          soft: "#F1F5F9",
          light: "#F8FAFC",
        },
      },
      fontFamily: {
        headline: ["Oswald", "var(--font-headline)", "sans-serif"],
        sans: ["Inter", "var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(11, 19, 43, 0.05), 0 1px 2px -1px rgba(11, 19, 43, 0.05)",
        card: "0 4px 6px -1px rgba(11, 19, 43, 0.07), 0 2px 4px -2px rgba(11, 19, 43, 0.05)",
        elevated: "0 10px 15px -3px rgba(11, 19, 43, 0.1), 0 4px 6px -4px rgba(11, 19, 43, 0.05)",
        broadcast: "0 4px 20px -2px rgba(0, 75, 147, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
