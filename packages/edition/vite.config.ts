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
              const { name, data } = JSON.parse(body)
              const filePath = path.resolve(__dirname, `../maps/${name}.json`)
              fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
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
