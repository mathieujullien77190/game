import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "components/": path.resolve(__dirname, "src/components") + "/",
      "engine/":     path.resolve(__dirname, "src/engine") + "/",
      "hooks/":      path.resolve(__dirname, "src/hooks") + "/",
      "store/":      path.resolve(__dirname, "src/store") + "/",
    },
  },
});
