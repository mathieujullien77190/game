import { defineConfig, type Plugin } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"
import { readFileSync } from "fs"
import path from "path"

// Bundle preview single-file (tout inliné dans un seul index.html) chargé par la WebView.
// __dirname = packages/app/webview → ../../.. = racine du repo.
const r = (p: string) => path.resolve(__dirname, "../../..", p)

const MAP_PATH = r("packages/maps/map.json")

// Dev only (`yarn app:web`) : reproduit l'injection RN (injectedJavaScriptBeforeContentLoaded)
// en injectant map.json dans la page avant main.ts, et recharge la page quand map.json change.
const injectMap = (): Plugin => ({
  name: "tic-tac-tic-inject-map",
  apply: "serve",
  transformIndexHtml: () => [
    {
      tag: "script",
      children: `window.__TICTACTIC_MAP__ = ${readFileSync(MAP_PATH, "utf8")}`,
      injectTo: "head-prepend",
    },
  ],
  configureServer: (server) => {
    server.watcher.add(MAP_PATH)
    server.watcher.on("change", (file) => {
      if (path.resolve(file) === MAP_PATH) server.ws.send({ type: "full-reload" })
    })
  },
})

export default defineConfig({
  plugins: [viteSingleFile(), injectMap()],
  // Désactive et élimine le Profiler (dead-code par esbuild) du bundle mobile — voir engine/src/CLAUDE.md.
  define: { __TICTACTIC_PROFILING__: JSON.stringify(false) },
  resolve: {
    alias: [
      { find: /^@tic-tac-tic\/engine\/(.*)$/, replacement: r("packages/engine/src/$1") },
      { find: /^@tic-tac-tic\/canvas-render$/, replacement: r("packages/canvas-render/src/index.ts") },
    ],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
})
