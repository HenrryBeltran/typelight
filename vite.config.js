import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        test: path.resolve(__dirname, "test.html"),
        tips: path.resolve(__dirname, "tips.html"),
        results: path.resolve(__dirname, "results.html"),
      },
    },
  },
});
