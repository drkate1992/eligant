import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        card: "var(--radius)",
      },
      colors: {
        navy: {
          DEFAULT: "#0d1b2a",
          mid: "#162132",
          light: "#1e2f44",
          card: "#192843",
        },
        brand: {
          DEFAULT: "#1ca65f",
          light: "#34c47b",
          dim: "#14834a",
          navy: "#16294d",
        },
        cream: "#f5f0e8",
        ink: {
          primary: "#eef3f0",
          secondary: "#a8b8cc",
          muted: "#6a7f96",
        },
        positive: "#34c47b",
        negative: "#e05c5c",
        line: "rgba(28, 166, 95, 0.16)",
        gold: "#c9a84c",
        muted: "#6a7f96",
      },
    },
  },
  plugins: [],
};

export default config;
