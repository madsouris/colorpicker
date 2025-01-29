// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import alpinejs from "@astrojs/alpinejs";

import AstroPWA from "@vite-pwa/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    alpinejs(),
    AstroPWA({
      registerType: "autoUpdate",
      includeAssets: ["bg.svg", "favicon.svg"],
      manifest: {
        name: "Color Picker",
        short_name: "ColorPicker",
        description: "Colors from Google Material Guideline",
        theme_color: "#FFFFFF",
        icons: [
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        navigateFallback: "/",
        globPatterns: ["**/*.{css,js,html,svg,png,ico,txt}"],
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\//],
      },
      experimental: {
        directoryAndTrailingSlashHandler: true,
      },
    }),
  ],
});
