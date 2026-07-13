#!/usr/bin/env node
// Vérifie que les alias sont synchronisés entre les DEUX sources de vérité :
//   - tsconfig.base.json  (compilerOptions.paths)         → typecheck
//   - packages/edition/vite.config.ts (resolve.alias)     → bundling web éditeur
//   - packages/app/webview/vite.config.ts (resolve.alias) → bundling webview mobile
// Le CLAUDE.md impose de garder ces fichiers synchro. Un alias présent côté
// typecheck mais absent côté Vite (ou l'inverse) passe le typecheck puis casse
// au runtime — exactement le genre de bug invisible que ce check attrape.

import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..")

// Normalise une clé d'alias vers son "token" de base : on ignore le suffixe /* ou /(.*)
// pour comparer @drift/engine/* et @drift/engine/(.*) comme le même alias.
const norm = (raw) =>
  raw
    .replace(/\\/g, "") // \/ → /
    .replace(/[$^]/g, "") // ancres regex
    .replace(/\/\(\.\*\)$/, "") // /(.*)
    .replace(/\/\*$/, "") // /*
    .replace(/\/$/, "") // slash final
    .trim()

const stripJsonc = (txt) => txt.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "")

const tsconfigTokens = async () => {
  const txt = await readFile(path.join(ROOT, "tsconfig.base.json"), "utf8")
  const json = JSON.parse(stripJsonc(txt))
  const paths = json.compilerOptions?.paths ?? {}
  return new Set(Object.keys(paths).map(norm))
}

// Extrait les `find:` d'un resolve.alias Vite (forme regex ou string).
const viteTokens = async (rel) => {
  const txt = await readFile(path.join(ROOT, rel), "utf8")
  const found = new Set()
  // find: /^...$/,   ou   find: "...",  — on ancre sur la virgule de fin d'entrée
  // pour que .+? traverse les slashs échappés (\/) au lieu de s'arrêter au premier.
  const re = /find:\s*(?:\/(.+?)\/[a-z]*|["'](.+?)["'])\s*,/g
  let m
  while ((m = re.exec(txt)) !== null) found.add(norm(m[1] ?? m[2]))
  return found
}

const diff = (a, b) => [...a].filter((x) => !b.has(x)).sort()

const run = async () => {
  const ts = await tsconfigTokens()
  const edition = await viteTokens("packages/edition/vite.config.ts")
  const webview = await viteTokens("packages/app/webview/vite.config.ts")

  const problems = []

  // edition doit couvrir EXACTEMENT les alias du typecheck.
  const missingInEdition = diff(ts, edition)
  const extraInEdition = diff(edition, ts)
  if (missingInEdition.length)
    problems.push(`edition/vite.config.ts : alias manquants (présents dans tsconfig.base) → ${missingInEdition.join(", ")}`)
  if (extraInEdition.length)
    problems.push(`edition/vite.config.ts : alias en trop (absents de tsconfig.base) → ${extraInEdition.join(", ")}`)

  // webview ne mappe qu'un sous-ensemble (engine + canvas-render), mais tout ce
  // qu'il mappe DOIT exister côté typecheck.
  const webviewUnknown = diff(webview, ts)
  if (webviewUnknown.length)
    problems.push(`app/webview/vite.config.ts : alias inconnus du tsconfig.base → ${webviewUnknown.join(", ")}`)

  console.log("── check-aliases ──")
  console.log(`  tsconfig.base : ${[...ts].sort().join(", ")}`)
  console.log(`  edition vite  : ${[...edition].sort().join(", ")}`)
  console.log(`  webview vite  : ${[...webview].sort().join(", ")}`)
  console.log("")

  if (problems.length === 0) {
    console.log("✅ Alias synchronisés.")
    return 0
  }
  for (const p of problems) console.log(`❌ ${p}`)
  return 1
}

run().then((code) => process.exit(code)).catch((e) => {
  console.error("check-aliases a échoué :", e.message)
  process.exit(2)
})
