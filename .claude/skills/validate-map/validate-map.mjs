#!/usr/bin/env node
// Valide la cohérence d'un map.json AVANT import/simulation. Points fragiles ciblés
// (cf. CLAUDE.md) : les linkId sont dérivés de l'ordre du tableau `lines`, les
// composants (transformer/inverter/switch/gate/cloner) sont nommés par leur linkId,
// et l'arrival exige des demands avec color ET type. Une incohérence ici produit un
// bug silencieux à la simulation.
//
// Usage : node validate-map.mjs [chemin/vers/map.json]
//         (défaut : packages/maps/map.json)

import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..")
const target = process.argv[2] ?? "packages/maps/map.json"
const mapPath = path.isAbsolute(target) ? target : path.join(ROOT, target)

const REQUIRED_KEYS = [
  "screens", "lines", "links", "starts", "switches",
  "cloners", "transformers", "inverters", "arrivals",
  "screenGates", "screenTimeMultipliers",
]

const run = async () => {
  const m = JSON.parse(await readFile(mapPath, "utf8"))
  const errors = []
  const warns = []

  // 0. clés top-level
  for (const k of REQUIRED_KEYS) if (!(k in m)) warns.push(`clé top-level manquante : "${k}"`)

  const screens = new Set(m.screens ?? [])
  const arr = (k) => (Array.isArray(m[k]) ? m[k] : [])

  // 1. lines : ids uniques
  const lineIds = new Set()
  for (const l of arr("lines")) {
    if (!l.id) errors.push("une line sans id")
    else if (lineIds.has(l.id)) errors.push(`line id dupliqué : ${l.id}`)
    else lineIds.add(l.id)
  }

  // 2. links : line1/line2 référencent des lines existantes ; ids uniques
  const linkIds = new Set()
  for (const lk of arr("links")) {
    if (lk.id) {
      if (linkIds.has(lk.id)) errors.push(`link id dupliqué : ${lk.id}`)
      linkIds.add(lk.id)
    }
    for (const side of ["line1", "line2"]) {
      const ref = lk[side]?.lineId
      if (ref && !lineIds.has(ref)) errors.push(`link ${lk.id} : ${side}.lineId "${ref}" n'existe pas`)
    }
  }

  // 3. composants nommés par linkId/lineId
  const checkRef = (kind, items) => {
    for (const it of items) {
      if ("linkId" in it && it.linkId && !linkIds.has(it.linkId))
        errors.push(`${kind} ${it.id ?? "?"} : linkId "${it.linkId}" n'existe pas dans links`)
      if ("lineId" in it && it.lineId && !lineIds.has(it.lineId))
        errors.push(`${kind} ${it.id ?? "?"} : lineId "${it.lineId}" n'existe pas dans lines`)
      if (it.screenId && !screens.has(it.screenId))
        warns.push(`${kind} ${it.id ?? "?"} : screenId "${it.screenId}" absent de screens`)
    }
  }
  checkRef("transformer", arr("transformers"))
  checkRef("inverter", arr("inverters"))
  checkRef("switch", arr("switches"))
  checkRef("screenGate", arr("screenGates"))
  checkRef("cloner", arr("cloners"))

  // 4. starts : au moins un (la sim n'en utilise qu'un)
  if (arr("starts").length === 0) warns.push("aucun start → rien à simuler")
  if (arr("starts").length > 1) warns.push(`${arr("starts").length} starts, mais la sim n'en utilise qu'un (Object.values(starts)[0])`)

  // 5. arrivals : lineId existant + demands avec color ET type
  if (arr("arrivals").length === 0) warns.push("aucune arrival")
  for (const a of arr("arrivals")) {
    if (a.lineId && !lineIds.has(a.lineId)) errors.push(`arrival ${a.id ?? "?"} : lineId "${a.lineId}" inexistant`)
    const demands = Array.isArray(a.demands) ? a.demands : []
    if (demands.length === 0) warns.push(`arrival ${a.id ?? "?"} : aucune demand`)
    for (const d of demands) {
      if (!d.color) errors.push(`arrival ${a.id ?? "?"} : demand ${d.id ?? "?"} sans color`)
      if (!d.type) errors.push(`arrival ${a.id ?? "?"} : demand ${d.id ?? "?"} sans type`)
    }
  }

  // 6. screenTimeMultipliers ⊆ screens
  for (const k of Object.keys(m.screenTimeMultipliers ?? {}))
    if (!screens.has(k)) warns.push(`screenTimeMultipliers : "${k}" absent de screens`)

  console.log(`── validate-map ── ${path.relative(ROOT, mapPath).replace(/\\/g, "/")}`)
  console.log(`  screens: ${screens.size} · lines: ${lineIds.size} · links: ${linkIds.size} · arrivals: ${arr("arrivals").length}`)
  console.log("")

  for (const w of warns) console.log(`⚠️  ${w}`)
  for (const e of errors) console.log(`❌ ${e}`)
  console.log("")

  if (errors.length === 0) {
    console.log(warns.length ? `✅ Map valide (${warns.length} avertissement(s)).` : "✅ Map valide.")
    return 0
  }
  console.log(`❌ ${errors.length} erreur(s), ${warns.length} avertissement(s).`)
  return 1
}

run().then((code) => process.exit(code)).catch((e) => {
  console.error("validate-map a échoué :", e.message)
  process.exit(2)
})
