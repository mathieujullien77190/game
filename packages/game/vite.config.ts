import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import fs from "fs"

export default defineConfig({
  plugins: [
    react(),
    {
      name: "serve-maps",
      configureServer(server) {
        server.middlewares.use("/maps", (req, res, next) => {
          const name = req.url?.replace(/^\//, "") ?? ""
          if (!name.endsWith(".json")) { next(); return }
          const filePath = path.resolve(__dirname, `../maps/${name}`)
          if (!fs.existsSync(filePath)) { next(); return }
          res.setHeader("Content-Type", "application/json")
          res.end(fs.readFileSync(filePath, "utf-8"))
        })
      },
    },
  ],
  resolve: {
    extensions: [".web.tsx", ".web.ts", ".tsx", ".ts", ".jsx", ".js"],
    alias: {
      "engine/svgElements": path.resolve(__dirname, "../../packages/engine/src/svgElements.web.ts"),
      "engine/": path.resolve(__dirname, "../../packages/engine/src") + "/",
      "components/": path.resolve(__dirname, "src/components") + "/",
      "store": path.resolve(__dirname, "src/store.ts"),
      "screens/": path.resolve(__dirname, "src/screens") + "/",
      "hooks/": path.resolve(__dirname, "src/hooks") + "/",
      "translations/": path.resolve(__dirname, "src/translations") + "/",
      "progressStore": path.resolve(__dirname, "src/progressStore.ts"),
      "langStore": path.resolve(__dirname, "src/langStore.ts"),
      "theme": path.resolve(__dirname, "src/theme.ts"),
      "maps": path.resolve(__dirname, "src/maps.ts"),
      "devStore": path.resolve(__dirname, "src/devStore.ts"),
    },
  },
})
