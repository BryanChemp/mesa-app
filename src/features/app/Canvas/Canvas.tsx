import { useRef, type FC, type PropsWithChildren } from "react"
import styled from "styled-components"
import { useCanvasStore } from "../../../stores/useCanvasStore"
import { useCanvasZoom } from "./hooks/useCanvasZoom"
import { useCanvasPan } from "./hooks/useCanvasPan"

interface CanvasProps extends PropsWithChildren {
  id: string
}

const Canvas: FC<CanvasProps> = ({ id, children }) => {
  const { getInstance } = useCanvasStore()
  const instance = getInstance(id)

  console.log("id", id)
  console.log("instance", instance)
  const containerRef = useRef<HTMLDivElement>(null)

  useCanvasZoom(containerRef, id)
  const { startDrag, stopDrag, onDrag } = useCanvasPan(id)

  return (
    <Container
      ref={containerRef}
      tabIndex={0}
      onMouseDown={startDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onMouseMove={onDrag}
      data-canvas-id={id}
    >
      <CanvasWrapper
        style={{
          transform: `translate(${instance.offset.x}px, ${instance.offset.y}px) scale(${instance.scale})`,
          transformOrigin: '0 0',
        }}
        data-canvas-container="true"
      >
        {children}
      </CanvasWrapper>
    </Container>
  )
}

export default Canvas

const Container = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  position: relative;
  outline: none;
`

const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: 0 0;
`