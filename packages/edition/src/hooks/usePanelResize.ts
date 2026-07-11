import { useCallback, useRef, useState } from "react"

export const usePanelResize = (initialWidth: number, min = 120) => {
  const [width, setWidth] = useState(initialWidth)
  const dragging = useRef(false)

  const onDividerMouseDown = useCallback(() => {
    dragging.current = true
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return
      setWidth(Math.max(min, Math.min(e.clientX, window.innerWidth - min)))
    }
    const onUp = () => {
      dragging.current = false
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }, [min])

  return { width, onDividerMouseDown }
}
