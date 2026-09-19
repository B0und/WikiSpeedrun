import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { lingui, linguiTransformerBabelPreset } from "@lingui/vite-plugin";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { configDefaults, defineConfig } from "vitest/config";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { reactClickToComponent } from "vite-plugin-react-click-to-component";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      verboseFileRoutes: false,
    }),
    react({ compiler: true }),
    lingui(),
    babel({ presets: [linguiTransformerBabelPreset()] }),
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
    // main.tsx awaits the initial Lingui catalog before rendering.
    target: "es2022",
  },
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["./src/setupFile.ts"],
    exclude: [...configDefaults.exclude, "e2e/**"],
    browser: {
      enabled: true,
      provider: playwright(),
      viewport: {
        width: 1920,
        height: 1080,
      },
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
});
