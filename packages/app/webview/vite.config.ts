import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"
import path from "path"

// Bundle preview single-file (tout inliné dans un seul index.html) chargé par la WebView.
// __dirname = packages/app/webview → ../../.. = racine du repo.
const r = (p: string) => path.resolve(__dirname, "../../..", p)

export default defineConfig({
  plugins: [viteSingleFile()],
  resolve: {
    alias: [
      { find: /^@drift\/engine\/(.*)$/, replacement: r("packages/engine/src/$1") },
      { find: /^@drift\/canvas-render$/, replacement: r("packages/canvas-render/src/index.ts") },
    ],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
})
