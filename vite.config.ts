import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { ViteEjsPlugin } from "vite-plugin-ejs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { visualizer } from "rollup-plugin-visualizer";
import { reactClickToComponent } from "vite-plugin-react-click-to-component";
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
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
});
