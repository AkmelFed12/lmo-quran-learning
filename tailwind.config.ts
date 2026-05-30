import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#fbf7ed",
        night: "#07140f",
        emerald: {
          50: "#f0fdf6",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          900: "#064e3b",
          950: "#022c22",
        },
        gold: "#C9A44B",
        darkgold: "#D4AF37",
        parchment: "#f4ecd8",
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        arabic: ["var(--font-amiri)", "serif"],
      },
      backgroundImage: {
        arabesque: "url('/images/arabesque.svg')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
