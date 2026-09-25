import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));
const apiTarget = process.env.VITE_API_URL || "http://localhost:3000";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(root, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(root, "src/styles")],
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/beacons": apiTarget,
      "/messages": apiTarget,
    },
  },
});
