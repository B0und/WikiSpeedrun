import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { splitVendorChunkPlugin } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    ViteEjsPlugin((config) => ({
      NODE_ENV: config.mode,
      isDev: config.mode === "development",
      isProd: config.mode === "production",
    })),
    splitVendorChunkPlugin(),
  ],
});
