import { create } from "zustand"

type Offset = { x: number; y: number }

type CanvasState = {
  offset: Offset
  scale: number
  dragging: boolean
  setOffset: (offset: Offset) => void
  moveOffset: (dx: number, dy: number) => void
  setScale: (scale: number) => void
  zoomAt: (mx: number, my: number, deltaY: number, containerRect: DOMRect) => void
  setDragging: (dragging: boolean) => void
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  offset: { x: 0, y: 0 },
  scale: 1,
  dragging: false,

  setOffset: (offset) => set({ offset }),
  moveOffset: (dx, dy) =>
    set((state) => ({ offset: { x: state.offset.x + dx, y: state.offset.y + dy } })),

  setScale: (scale) => set({ scale }),

  zoomAt: (mx, my, deltaY) => {
    const zoomIntensity = 0.07
    const factor = deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity

    const prevScale = get().scale
    const nextScale = Math.min(Math.max(prevScale * factor, 0.1), 5)

    const prevOffset = get().offset
    const x = (mx - prevOffset.x) / prevScale
    const y = (my - prevOffset.y) / prevScale

    set({
      scale: nextScale,
      offset: {
        x: mx - x * nextScale,
        y: my - y * nextScale,
      },
    })
  },

  setDragging: (dragging) => set({ dragging }),
}))
