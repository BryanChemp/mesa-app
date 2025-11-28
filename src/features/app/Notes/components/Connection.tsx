// components/Connection/Connection.tsx
import React from 'react'
import styled from 'styled-components'
import { useNotesStore } from '../../../../stores/useNoteStore'

interface ConnectionProps {
  connection: {
    id: string
    points: { x: number; y: number }[]
  }
}

export const Connection: React.FC<ConnectionProps> = ({ connection }) => {
  const { deleteConnection } = useNotesStore()

  if (connection.points.length < 4) return null

  const [p0, p1, p2, p3] = connection.points
  const pathData = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteConnection(connection.id)
  }

  return (
    <g>
      <StyledPath
        d={pathData}
        stroke="#007bff"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrowhead)"
      />
      <ClickArea
        d={pathData}
        stroke="transparent"
        strokeWidth="20"
        fill="none"
        onClick={handleClick}
      />
    </g>
  )
}

const StyledPath = styled.path`
  stroke: #007bff;
  stroke-width: 2;
  fill: none;
  marker-end: url(#arrowhead);

  &:hover {
    stroke: #0056b3;
    stroke-width: 3;
  }
`

const ClickArea = styled.path`
  stroke: transparent;
  stroke-width: 20;
  fill: none;
  cursor: pointer;

  &:hover {
    stroke: rgba(0, 123, 255, 0.1);
  }
`