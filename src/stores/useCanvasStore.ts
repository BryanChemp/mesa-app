// stores/useCanvasStore.ts
import { create } from 'zustand'

type Offset = { x: number; y: number }

type CanvasInstance = {
  offset: Offset
  scale: number
  dragging: boolean
}

type CanvasState = {
  instances: Record<string, CanvasInstance>
  setOffset: (id: string, offset: Offset) => void
  moveOffset: (id: string, dx: number, dy: number) => void
  setScale: (id: string, scale: number) => void
  zoomAt: (id: string, mx: number, my: number, deltaY: number, containerRect: DOMRect) => void
  setDragging: (id: string, dragging: boolean) => void
  getInstance: (id: string) => CanvasInstance
  // Nova função para converter coordenadas da tela para coordenadas do canvas
  screenToCanvas: (id: string, screenX: number, screenY: number, containerRect: DOMRect) => { x: number; y: number }
}

const defaultInstance: CanvasInstance = {
  offset: { x: 0, y: 0 },
  scale: 1,
  dragging: false,
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  instances: {},

  setOffset: (id, offset) =>
    set((state) => ({
      instances: {
        ...state.instances,
        [id]: { 
          ...(state.instances[id] || defaultInstance), 
          offset 
        },
      },
    })),

  moveOffset: (id, dx, dy) =>
    set((state) => {
      const instance = state.instances[id] || defaultInstance
      return {
        instances: {
          ...state.instances,
          [id]: {
            ...instance,
            offset: {
              x: instance.offset.x + dx,
              y: instance.offset.y + dy,
            },
          },
        },
      }
    }),

  setScale: (id, scale) =>
    set((state) => ({
      instances: {
        ...state.instances,
        [id]: { 
          ...(state.instances[id] || defaultInstance), 
          scale 
        },
      },
    })),

  zoomAt: (id, mx, my, deltaY) => {
    const state = get()
    const instance = state.instances[id] || defaultInstance
    
    const zoomIntensity = 0.07
    const factor = deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity

    const prevScale = instance.scale
    const nextScale = Math.min(Math.max(prevScale * factor, 0.1), 5)

    const prevOffset = instance.offset
    const x = (mx - prevOffset.x) / prevScale
    const y = (my - prevOffset.y) / prevScale

    set({
      instances: {
        ...state.instances,
        [id]: {
          ...instance,
          scale: nextScale,
          offset: {
            x: mx - x * nextScale,
            y: my - y * nextScale,
          },
        },
      },
    })
  },

  setDragging: (id, dragging) =>
    set((state) => ({
      instances: {
        ...state.instances,
        [id]: { 
          ...(state.instances[id] || defaultInstance), 
          dragging 
        },
      },
    })),

  getInstance: (id) => {
    return get().instances[id] || defaultInstance
  },

  // Nova função para converter coordenadas da tela para coordenadas do canvas
  screenToCanvas: (id, screenX, screenY, containerRect) => {
    const instance = get().instances[id] || defaultInstance
    const x = (screenX - instance.offset.x) / instance.scale
    const y = (screenY - instance.offset.y) / instance.scale
    return { x, y }
  },
}))