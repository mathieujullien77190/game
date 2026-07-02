import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

const r = (p: string) => path.resolve(__dirname, "../..", p)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@drift\/engine\/(.*)$/, replacement: r("packages/engine/src/$1") },
      { find: /^@drift\/maps\/(.*)$/, replacement: r("packages/maps/$1") },
      { find: /^@drift\/game$/, replacement: r("packages/game/src/index.ts") },
    ],
  },
})
