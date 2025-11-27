import { useRef } from "react"
import { useCanvasStore } from "../../../../stores/useCanvasStore"

export function useCanvasPan(canvasId: string) {
  const { setDragging, moveOffset, getInstance } = useCanvasStore()
  const instance = getInstance(canvasId)
  const dragging = instance.dragging

  const canMoveCanvas = true
  const lastPos = useRef({ x: 0, y: 0 })

  const startDrag = (e: React.MouseEvent) => {
    if (canMoveCanvas) {
      setDragging(canvasId, true)
      lastPos.current = { x: e.clientX, y: e.clientY }
      e.preventDefault()
    }
  }

  const stopDrag = () => setDragging(canvasId, false)

  const onDrag = (e: React.MouseEvent) => {
    if (!dragging) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    moveOffset(canvasId, dx, dy)
  }

  return { startDrag, stopDrag, onDrag }
}