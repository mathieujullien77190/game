#!/usr/bin/env node
// Commande de checkup : lance toutes les vérifications du projet en une fois et
// affiche un récap. Exit code = nombre de vérifications en échec.

import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import path from "node:path"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..")
const SKILLS = path.join(ROOT, ".claude/skills")

const checks = [
  { name: "check-aliases", cmd: "node", args: [path.join(SKILLS, "check-aliases/check-aliases.mjs")] },
  { name: "check-engine-purity", cmd: "node", args: [path.join(SKILLS, "check-engine-purity/check-engine-purity.mjs")] },
  { name: "validate-map", cmd: "node", args: [path.join(SKILLS, "validate-map/validate-map.mjs")] },
]

console.log("╔══════════════════════════════════════╗")
console.log("║          DRIFT · CHECKUP             ║")
console.log("╚══════════════════════════════════════╝\n")

const results = []
for (const c of checks) {
  const r = spawnSync(c.cmd, c.args, { cwd: ROOT, encoding: "utf8", shell: false })
  process.stdout.write(r.stdout ?? "")
  if (r.stderr) process.stderr.write(r.stderr)
  console.log("")
  results.push({ name: c.name, ok: r.status === 0 })
}

console.log("──────────────── RÉCAP ────────────────")
for (const r of results) console.log(`  ${r.ok ? "✅" : "❌"}  ${r.name}`)

const failed = results.filter((r) => !r.ok).length
console.log("")
if (failed === 0) {
  console.log("🎉 Tout est vert. (Pense à `yarn lint` pour le style.)")
} else {
  console.log(`⚠️  ${failed} vérification(s) en échec — voir le détail ci-dessus.`)
}
process.exit(failed)
