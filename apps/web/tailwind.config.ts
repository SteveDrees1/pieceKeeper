import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: [
    "./app.vue",
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Space Grotesk", "Inter", "ui-sans-serif", "system-ui"]
      },
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        brand: {
          primary: "rgb(var(--brand-primary) / <alpha-value>)",
          primaryHover: "rgb(var(--brand-primary-hover) / <alpha-value>)",
          accent: "rgb(var(--brand-accent) / <alpha-value>)",
          highlight: "rgb(var(--brand-highlight) / <alpha-value>)"
        }
      },
      borderRadius: {
        xl: "16px",
        lg: "12px"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.06)",
        card: "0 8px 24px rgba(15, 23, 42, 0.10)",
        elevated: "0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 10px 20px -5px rgba(15, 23, 42, 0.08)",
        glow: "0 0 0 1px rgba(47, 128, 237, 0.15), 0 0 24px -4px rgba(47, 128, 237, 0.12)"
      }
    }
  }
};