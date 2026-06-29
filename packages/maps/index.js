// Dynamic map registry for the game (Metro/Expo bundler).
// require.context here uses a real relative dir ("./") so it resolves reliably
// on web + native. Edition (Vite) does not use this file — it reads via fetch.
const ctx = require.context("./", false, /\.json$/)

const MAP_DATA = {}
for (const key of ctx.keys()) {
  const file = key.replace(/^\.\//, "")
  if (file === "_index.json") continue
  MAP_DATA[file] = ctx(key)
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const MAP_INDEX = require("./_index.json")

module.exports = { MAP_DATA, MAP_INDEX }
