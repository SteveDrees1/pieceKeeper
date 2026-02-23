import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";

// Load repo-root .env so REBRICKABLE_API_KEY etc. work when running from apps/web
const rootDir = path.dirname(fileURLToPath(import.meta.url));
const repoEnv = path.resolve(rootDir, "../../.env");
const dotenv = await import("dotenv");
dotenv.config({ path: repoEnv });

export default defineNuxtConfig({
  devtools: { enabled: false },
  typescript: { strict: true },

  ssr: false,

  compatibilityDate: "2026-02-23",

  modules: ["@nuxtjs/tailwindcss"],

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      title: "Piece Keeper",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "theme-color", content: "#0c1423" },
        { name: "description", content: "LEGO collection inventory, pricing, and marketplace." }
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href:
            "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap"
        }
      ]
    }
  },

  runtimeConfig: {
    rebrickableApiKey: process.env.REBRICKABLE_API_KEY || "",
    public: {
      appName: process.env.APP_NAME || "Piece Keeper",
      meiliHost: process.env.MEILI_HOST || "http://localhost:7700"
    }
  }
});