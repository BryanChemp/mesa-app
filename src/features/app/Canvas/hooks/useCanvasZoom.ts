import { useEffect } from "react"
import { useCanvasStore } from "../../../../stores/useCanvasStore"

export function useCanvasZoom(
  containerRef: React.RefObject<HTMLDivElement | null>,
  canvasId: string
) {
  const { zoomAt } = useCanvasStore()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      zoomAt(
        canvasId,
        e.clientX - el.getBoundingClientRect().left,
        e.clientY - el.getBoundingClientRect().top,
        e.deltaY,
        el.getBoundingClientRect()
      )
    }

    el.addEventListener("wheel", handleWheel, { passive: false })
    return () => el.removeEventListener("wheel", handleWheel)
  }, [zoomAt, containerRef, canvasId])
}