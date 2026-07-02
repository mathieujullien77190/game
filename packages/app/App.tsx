import { useEffect, useRef, useState } from "react"
import { View, type LayoutChangeEvent } from "react-native"
import { Canvas, Picture, createPicture, type SkPicture } from "@shopify/react-native-skia"
import { buildPreviewManager } from "@drift/engine/Map/loadPreview"
import type { MapJson } from "@drift/engine/Map/mapJson"
import { CANVAS_W, CANVAS_H } from "@drift/engine/constants"
import { SkiaRenderer } from "@drift/skia-render"
import mapJson from "@drift/maps/map.json"

// Interface de jeu React Native — fait EXACTEMENT ce que la preview web fait :
// charge la map, tick la simulation, dessine via l'engine sur un SkCanvas (Skia).
// (les effets plein écran inverter/dark sont web-only pour l'instant — déférés.)

export default function App() {
  const pm = useRef(buildPreviewManager(mapJson as MapJson)).current
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [picture, setPicture] = useState<SkPicture | null>(null)

  useEffect(() => {
    if (size.w === 0 || size.h === 0) return
    const scale = Math.min(size.w / CANVAS_W, size.h / CANVAS_H)
    let raf: number
    const loop = (t: number) => {
      pm.tickSim(t)
      const pic = createPicture((canvas) => {
        canvas.scale(scale, scale)
        const r = new SkiaRenderer(canvas, CANVAS_W, CANVAS_H)
        pm.drawAllPreview(r)
      })
      setPicture(pic)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [size, pm])

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    setSize({ w: width, h: height })
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f0f0" }} onLayout={onLayout}>
      <Canvas style={{ flex: 1 }}>{picture && <Picture picture={picture} />}</Canvas>
    </View>
  )
}
