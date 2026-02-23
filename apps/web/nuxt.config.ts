import { defineNuxtConfig } from "nuxt/config";

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
    public: {
      appName: process.env.APP_NAME || "Piece Keeper",
      meiliHost: process.env.MEILI_HOST || "http://localhost:7700"
    }
  }
});