import { useRef, type FC, type PropsWithChildren } from "react"
import styled from "styled-components"
import { useCanvasStore } from "../../../stores/useCanvasStore"
import { useCanvasZoom } from "./hooks/useCanvasZoom"
import { useCanvasPan } from "./hooks/useCanvasPan"

const Canvas: FC<PropsWithChildren> = ({ children }) => {
  const { offset, scale } = useCanvasStore()

  const containerRef = useRef<HTMLDivElement>(null)

  useCanvasZoom(containerRef)
  const { startDrag, stopDrag, onDrag } = useCanvasPan()

  return (
    <Container
      ref={containerRef}
      tabIndex={0}
      onMouseDown={startDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onMouseMove={onDrag}
    >
      <CanvasWrapper
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "0 0",
        }}
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

