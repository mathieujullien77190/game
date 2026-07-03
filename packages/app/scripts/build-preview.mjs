// Build le bundle web preview (packages/app/webview) en single-file HTML, puis
// le sérialise dans packages/app/src/previewHtml.ts (chargé par la WebView de App.tsx).
// À relancer quand l'engine / le renderer / webview/main.ts changent (pas quand la map change).
//   node scripts/build-preview.mjs

import { build } from "vite"
import { readFileSync, writeFileSync, mkdirSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const webviewDir = path.resolve(__dirname, "../webview")

await build({ root: webviewDir, configFile: path.join(webviewDir, "vite.config.ts") })

const html = readFileSync(path.join(webviewDir, "dist/index.html"), "utf8")
const out = path.resolve(__dirname, "../src/previewHtml.ts")
mkdirSync(path.dirname(out), { recursive: true })
writeFileSync(
  out,
  `// AUTO-GÉNÉRÉ par scripts/build-preview.mjs — ne pas éditer à la main.\nexport const previewHtml = ${JSON.stringify(html)}\n`,
)
console.log(`previewHtml.ts généré (${html.length} chars)`)
