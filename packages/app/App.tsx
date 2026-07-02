import { useEffect, useState } from "react"
import { View, type LayoutChangeEvent } from "react-native"
import { Canvas, Picture, createPicture, type SkPicture } from "@shopify/react-native-skia"
import { useSharedValue } from "react-native-reanimated"
import { buildPreviewManager } from "@drift/engine/Map/loadPreview"
import type { MapJson } from "@drift/engine/Map/mapJson"
import { CANVAS_W, CANVAS_H } from "@drift/engine/constants"
import { SkiaRenderer } from "@drift/skia-render"
import mapJson from "@drift/maps/map.json"

// Interface de jeu React Native — fait EXACTEMENT ce que la preview web fait :
// charge la map, tick la simulation, dessine via l'engine sur un SkCanvas (Skia).
// (les effets plein écran inverter/dark sont web-only pour l'instant — déférés.)
//
// Perf : la SkPicture vit dans un SharedValue reanimated, pas dans un useState.
// La boucle rAF réassigne `picture.value` chaque frame → Skia repeint côté UI thread
// SANS re-render React (pas de reconciliation 60×/s). C'est la grosse différence de
// coût vs un setState par frame.

export default function App() {
  const [pm] = useState(() => buildPreviewManager(mapJson as MapJson))
  const [size, setSize] = useState({ w: 0, h: 0 })
  const picture = useSharedValue<SkPicture>(createPicture(() => {}))

  useEffect(() => {
    if (size.w === 0 || size.h === 0) return
    const scale = Math.min(size.w / CANVAS_W, size.h / CANVAS_H)
    const offX = (size.w - CANVAS_W * scale) / 2
    const offY = (size.h - CANVAS_H * scale) / 2
    let raf: number
    let frame = 0
    let simAcc = 0
    let drawAcc = 0
    const loop = (t: number) => {
      const a = performance.now()
      pm.tickSim(t)
      const b = performance.now()
      picture.value = createPicture((canvas) => {
        canvas.translate(offX, offY)
        canvas.scale(scale, scale)
        const r = new SkiaRenderer(canvas, CANVAS_W, CANVAS_H)
        pm.drawAllPreview(r)
      })
      const c = performance.now()
      simAcc += b - a
      drawAcc += c - b
      if (++frame >= 60) {
        console.log(`PERF sim=${(simAcc / 60).toFixed(2)}ms record=${(drawAcc / 60).toFixed(2)}ms tokens=${pm.data.tokens.length}`)
        frame = 0; simAcc = 0; drawAcc = 0
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [size, pm, picture])

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    setSize({ w: width, h: height })
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f0f0" }} onLayout={onLayout}>
      <Canvas style={{ flex: 1 }}>
        <Picture picture={picture} />
      </Canvas>
    </View>
  )
}
