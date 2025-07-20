/// <reference types="vitest/config" />

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { reactClickToComponent } from "vite-plugin-react-click-to-component";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      verboseFileRoutes: false,
    }),
    react(),
    reactClickToComponent(),
    svgr(),
    ViteEjsPlugin((config) => ({
      NODE_ENV: config.mode,
      isDev: config.mode === "development",
      isProd: config.mode === "production",
    })),
    // visualizer({
    //   template: "treemap", // or sunburst
    //   open: true,
    //   // sourcemap: true,
    //   filename: "analyse.html", // will be saved in project's root
    // }),
  ],
  build: {
    minify: "esbuild",
    sourcemap: false,
  },
  test: {
    setupFiles: ['./src/setupFile.ts'],
    browser: {
      enabled: true,
      provider: "playwright",
      
      viewport: {
        width: 1920,
        height: 1080,
      },

      headless: true,
      // https://vitest.dev/guide/browser/playwright
      instances: [{ browser: "chromium" }],
    },
  },
});
