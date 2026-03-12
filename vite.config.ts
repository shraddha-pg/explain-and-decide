import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, existsSync, mkdirSync } from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-files",
      closeBundle() {
        if (!existsSync("dist")) mkdirSync("dist");
        for (const [s, d] of [
          ["public/manifest.json", "dist/manifest.json"],
          ["public/icon16.png", "dist/icon16.png"],
          ["public/icon48.png", "dist/icon48.png"],
          ["public/icon128.png", "dist/icon128.png"],
          ["src/content/content.css", "dist/content.css"],
        ]) { try { copyFileSync(s, d); } catch {} }
      },
    },
  ],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        background: resolve(__dirname, "src/background/background.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
        format: "es",
      },
    },
  },
});
