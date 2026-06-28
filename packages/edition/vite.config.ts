import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import fs from "fs"

export default defineConfig({
  plugins: [
    react(),
    {
      name: "save-map",
      configureServer(server) {
        server.middlewares.use("/api/save-map", (req, res) => {
          if (req.method !== "POST") {
            res.statusCode = 405
            res.end()
            return
          }
          let body = ""
          req.on("data", (chunk: Buffer) => { body += chunk.toString() })
          req.on("end", () => {
            try {
              const { name, data, mapList, mapDifficulties, mapStarThresholds } = JSON.parse(body)
              const mapsDir = path.resolve(__dirname, "../maps")
              fs.writeFileSync(path.join(mapsDir, `${name}.json`), JSON.stringify(data, null, 2))
              if (Array.isArray(mapList)) {
                const diffs: Record<string, string> = mapDifficulties ?? {}
                const stars: Record<string, { star1?: number; star2?: number; star3?: number }> = mapStarThresholds ?? {}
                const index = mapList.map((id: string) => ({
                  id,
                  file: `${id}.json`,
                  difficulty: diffs[id] ?? "Tutorial",
                  star1: stars[id]?.star1 ?? 180,
                  star2: stars[id]?.star2 ?? 120,
                  star3: stars[id]?.star3 ?? 60,
                }))
                fs.writeFileSync(path.join(mapsDir, "_index.json"), JSON.stringify(index, null, 2))
              }
              res.setHeader("Content-Type", "application/json")
              res.end(JSON.stringify({ ok: true }))
            } catch (e) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: String(e) }))
            }
          })
        })
      },
    },
  ],
  resolve: {
    alias: {
      "engine/": path.resolve(__dirname, "../../packages/engine/src") + "/",
      "components/": path.resolve(__dirname, "src/components") + "/",
      "store/": path.resolve(__dirname, "src/store") + "/",
      "store": path.resolve(__dirname, "src/store/index.ts"),
      "hooks/": path.resolve(__dirname, "src/hooks") + "/",
      "@tickwire/game": path.resolve(__dirname, "../game/src/index.ts"),
    },
  },
})
