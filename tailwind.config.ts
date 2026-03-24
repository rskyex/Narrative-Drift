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
        drift: {
          bg: "#0a0a0a",
          surface: "#141414",
          border: "#1f1f1f",
          text: "#e8e8e8",
          muted: "#737373",
          accent: "#c4b5a0",
          alert: "#a67c6d",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "'Times New Roman'", "Times", "serif"],
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        prose: "38rem",
      },
    },
  },
  plugins: [],
};

export default config;
