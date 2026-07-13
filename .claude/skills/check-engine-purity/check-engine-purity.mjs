#!/usr/bin/env node
// Garde-fou portabilité de l'engine. CLAUDE.md : `engine/` doit être ZÉRO React,
// ZÉRO DOM (lib ES2023 sans DOM) — pour rester portable RN/WebView. Et le pattern
// Base → Editor / Preview impose que la classe de BASE n'ait JAMAIS de `draw`.
// Ce script grep packages/engine/src pour ces trois violations.

import { readFile, readdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..")
const ENGINE = path.join(ROOT, "packages/engine/src")

const walk = async (dir) => {
  const out = []
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(full)))
    else if (e.name.endsWith(".ts")) out.push(full)
  }
  return out
}

// Imports interdits (React / styled-components / store zustand).
const FORBIDDEN_IMPORT = /\bfrom\s+["'](react|react-dom|styled-components|zustand)["']/
// Globals DOM interdits (heuristique : on ignore les lignes de commentaire).
const DOM_GLOBALS = /\b(document|window|localStorage|navigator|requestAnimationFrame)\b\s*[.\(]/
const isComment = (line) => {
  const t = line.trim()
  return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")
}
// Définition d'une méthode draw (draw = ... ou draw(...))
const DRAW_DEF = /\bdraw\s*[=(]/

const rel = (p) => path.relative(ROOT, p).replace(/\\/g, "/")

const run = async () => {
  const files = await walk(ENGINE)
  const violations = []

  for (const file of files) {
    const txt = await readFile(file, "utf8")
    const lines = txt.split(/\r?\n/)

    lines.forEach((line, i) => {
      if (isComment(line)) return
      if (FORBIDDEN_IMPORT.test(line))
        violations.push({ file, line: i + 1, kind: "import", msg: line.trim() })
      else if (DOM_GLOBALS.test(line))
        violations.push({ file, line: i + 1, kind: "dom", msg: line.trim() })
    })

    // Classe de base = <Name>.ts dans entities/<Name>/ (pas *Editor/*Preview/*Utils).
    const base = path.basename(file)
    const parent = path.basename(path.dirname(file))
    const isBaseEntity =
      base === `${parent}.ts` && !/Editor|Preview|Utils/.test(base)
    if (isBaseEntity) {
      // On ne flague que si le draw est sur une ligne de code réelle (pas un commentaire).
      const ln = lines.findIndex((l) => DRAW_DEF.test(l) && !isComment(l))
      if (ln !== -1)
        violations.push({ file, line: ln + 1, kind: "base-draw", msg: "classe de base avec un `draw`" })
    }
  }

  console.log("── check-engine-purity ──")
  console.log(`  ${files.length} fichiers .ts scannés dans packages/engine/src`)
  console.log("")

  if (violations.length === 0) {
    console.log("✅ Engine pur : pas de React/DOM, pas de draw en classe de base.")
    return 0
  }

  const label = { import: "IMPORT INTERDIT", dom: "GLOBAL DOM", "base-draw": "DRAW EN BASE" }
  for (const v of violations)
    console.log(`❌ [${label[v.kind]}] ${rel(v.file)}:${v.line}  ${v.msg}`)
  console.log("")
  console.log(`${violations.length} violation(s). (DOM = heuristique : vérifier si faux positif dans un commentaire/string.)`)
  return 1
}

run().then((code) => process.exit(code)).catch((e) => {
  console.error("check-engine-purity a échoué :", e.message)
  process.exit(2)
})
