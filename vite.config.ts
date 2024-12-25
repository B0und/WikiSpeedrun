import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { visualizer } from "rollup-plugin-visualizer";
import { reactClickToComponent } from "vite-plugin-react-click-to-component";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    reactClickToComponent(),
    svgr(),
    ViteEjsPlugin((config) => ({
      NODE_ENV: config.mode,
      isDev: config.mode === "development",
      isProd: config.mode === "production",
    })),
    visualizer({
      template: "treemap", // or sunburst
      open: true,
      // sourcemap: true,
      filename: "analyse.html", // will be saved in project's root
    }),
  ],
  build: {
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      treeshake: "smallest",
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          reactSelect: ["react-select"],
          dompurify: ["dompurify"],
          reResizable: ["re-resizable"],
          reactRouter: ["react-router"],
          tailwindMerge: ["tailwind-merge"],
        },
      },
    },
  },
});
