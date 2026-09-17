import { playwright } from "@vitest/browser-playwright";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { configDefaults, defineConfig } from "vitest/config";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { reactClickToComponent } from "vite-plugin-react-click-to-component";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      verboseFileRoutes: false,
    }),
    react({
      compiler: true,
    }),
    reactClickToComponent(),
    svgr(),
    ViteEjsPlugin((config) => ({
      NODE_ENV: config.mode,
      isDev: config.mode === "development",
      isProd: config.mode === "production",
    })),
  ],
  build: {
    minify: "esbuild",
    sourcemap: false,
  },
  test: {
    setupFiles: ['./src/setupFile.ts'],
    exclude: [...configDefaults.exclude, 'e2e/**'],
    browser: {
      enabled: true,
      provider: playwright(),

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
