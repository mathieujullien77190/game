import { defineConfig, type Plugin } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"
import { readFileSync } from "fs"
import path from "path"
import { MAPS_DIR, isMapFile, listMapFiles } from "../../maps/mapFiles.mjs"

// Bundle single-file (tout inliné dans un seul index.html). Deux cibles :
//   - défaut (`build:preview`) → dist/ → previewHtml.ts, chargé par la WebView RN qui injecte les niveaux ;
//   - `--mode web` (`build:web`) → dist-web/ : version web autonome (GitHub Pages / iframe),
//     niveaux intégrés au build.
// __dirname = packages/app/webview → ../../.. = racine du repo.
const r = (p: string) => path.resolve(__dirname, "../../..", p)

// Injecte tous les maps/map*.json dans la page avant main.ts (même règle que l'index généré
// utilisé par App.tsx, cf. maps/mapFiles.mjs). Actif en dev (`yarn app:web` : reproduit
// l'injection RN et recharge la page quand une map est créée, modifiée ou supprimée) et pour le
// build web autonome ; jamais pour le bundle RN (c'est App.tsx qui injecte).
const injectLevels = (): Plugin => ({
  name: "tic-tac-tic-inject-levels",
  apply: (_config, env) => env.command === "serve" || env.mode === "web",
  transformIndexHtml: () => [
    {
      tag: "script",
      children: `window.__TICTACTIC_LEVELS__ = [${listMapFiles()
        .map((f) => `{"id":${JSON.stringify(f.replace(/\.json$/, ""))},"json":${readFileSync(path.join(MAPS_DIR, f), "utf8")}}`)
        .join(",")}]`,
      injectTo: "head-prepend",
    },
  ],
  configureServer: (server) => {
    server.watcher.add(MAPS_DIR)
    const onMap = (file: string) => {
      if (path.dirname(path.resolve(file)) === MAPS_DIR && isMapFile(path.basename(file))) {
        server.ws.send({ type: "full-reload" })
      }
    }
    server.watcher.on("change", onMap)
    server.watcher.on("add", onMap)
    server.watcher.on("unlink", onMap)
  },
})

export default defineConfig(({ mode }) => ({
  plugins: [viteSingleFile(), injectLevels()],
  // Désactive et élimine le Profiler (dead-code par esbuild) du bundle mobile — voir engine/src/CLAUDE.md.
  define: { __TICTACTIC_PROFILING__: JSON.stringify(false) },
  resolve: {
    alias: [
      { find: /^@tic-tac-tic\/engine\/(.*)$/, replacement: r("packages/engine/src/$1") },
      { find: /^@tic-tac-tic\/canvas-render$/, replacement: r("packages/canvas-render/src/index.ts") },
    ],
  },
  build: {
    outDir: mode === "web" ? "dist-web" : "dist",
    emptyOutDir: true,
  },
}))
