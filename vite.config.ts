import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, mkdirSync } from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-extension-files",
      closeBundle() {
        // Copy manifest
        copyFileSync("public/manifest.json", "dist/manifest.json");
        // Copy icons
        for (const size of [16, 48, 128]) {
          try { copyFileSync(`public/icon${size}.png`, `dist/icon${size}.png`); } catch {}
        }
        // Copy content CSS directly (manifest references it as a static file)
        try {
          copyFileSync("src/content/content.css", "dist/content.css");
        } catch {}
      },
    },
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        background: resolve(__dirname, "src/background/background.ts"),
        content: resolve(__dirname, "src/content/content.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
