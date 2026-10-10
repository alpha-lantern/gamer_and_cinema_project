import { resolve } from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "src/",
  plugins: [tailwindcss()],
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        explore: resolve(__dirname, "src/explore/index.html"),
        saved: resolve(__dirname, "src/saved_titles/index.html"),
        details: resolve(__dirname, "src/details/index.html")
      },
    },
  },
});
