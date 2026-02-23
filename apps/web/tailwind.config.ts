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
        soft: "0 1px 2px rgba(0, 0, 0, 0.2)",
        card: "0 8px 24px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(96, 165, 250, 0.08)",
        elevated:
          "0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(96, 165, 250, 0.08), 0 0 24px -8px rgba(96, 165, 250, 0.12)",
        glow: "0 0 0 1px rgba(96, 165, 250, 0.2), 0 0 24px -4px rgba(96, 165, 250, 0.25)",
        "glow-sm": "0 0 12px -4px rgba(96, 165, 250, 0.2)"
      }
    }
  }
};
