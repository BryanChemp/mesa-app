// components/Notes/Notes.tsx
import React, { useCallback, useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Connection } from './components/Connection'
import { Note } from './components/Note'
import { useNotesStore } from '../../../stores/useNoteStore'
import { useCanvasStore } from '../../../stores/useCanvasStore'
import Canvas from '../Canvas/Canvas'

const getRandomColor = () => {
  const colors = [
    '#ffeb3b', // Amarelo
    '#90caf9', // Azul claro
    '#a5d6a7', // Verde claro
    '#f48fb1', // Rosa
    '#ce93d8', // Roxo
    '#80deea', // Ciano,
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export const Notes: React.FC = () => {
  const {
    notes,
    connections,
    tempConnection,
    addNote,
    selectNote,
    updateTempConnection,
    completeConnection,
    stopEditing
  } = useNotesStore()

  const { screenToCanvas } = useCanvasStore()

  const [contextMenu, setContextMenu] = useState<{ 
    x: number; 
    y: number;
    clientX: number;
    clientY: number;
  } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const contextMenuRef = useRef<HTMLDivElement>(null)

  // Fechar context menu ao clicar fora - AGORA SÓ NO CANVAS ATUAL
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenu && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setContextMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [contextMenu])

  // Posicionar o context menu após o render
  useEffect(() => {
    if (contextMenu && contextMenuRef.current) {
      const menuWidth = 200
      const menuHeight = 120

      let left = contextMenu.clientX
      let top = contextMenu.clientY

      // Verificar se o menu vai sair da tela à direita
      if (left + menuWidth > window.innerWidth) {
        left = contextMenu.clientX - menuWidth
      }

      // Verificar se o menu vai sair da tela na parte inferior
      if (top + menuHeight > window.innerHeight) {
        top = contextMenu.clientY - menuHeight
      }

      // Garantir que o menu não saia da tela à esquerda ou topo
      left = Math.max(10, left)
      top = Math.max(10, top)

      contextMenuRef.current.style.left = `${left}px`
      contextMenuRef.current.style.top = `${top}px`
    }
  }, [contextMenu])

  const handleCanvasContextMenu = (e: React.MouseEvent) => {
    // Verificar se o clique foi dentro deste canvas específico
    if (!canvasContainerRef.current?.contains(e.target as Node)) {
      return
    }

    e.preventDefault()
    e.stopPropagation()
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      
      // Converter coordenadas da tela para coordenadas do canvas
      const canvasCoords = screenToCanvas('notes', e.clientX - rect.left, e.clientY - rect.top, rect)
      
      setContextMenu({
        x: canvasCoords.x,
        y: canvasCoords.y,
        clientX: e.clientX,
        clientY: e.clientY
      })
    }
  }

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Clicar com botão esquerdo: desselecionar nota e fechar context menu
      if (contextMenu) {
        setContextMenu(null)
      }
      selectNote(null)
      stopEditing()
    }

    if (e.button === 2 && !contextMenu) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleAddNote = () => {
    if (contextMenu) {
      addNote({
        x: contextMenu.x - 100, // Centraliza a nota no ponto clicado
        y: contextMenu.y - 50,
        width: 200,
        height: 100,
        content: 'Nova anotação...',
        color: getRandomColor()
      })
      setContextMenu(null)
    }
  }

  const handleClearAllNotes = () => {
    useNotesStore.setState({ 
      notes: [], 
      connections: [], 
      selectedNoteId: null, 
      editingNoteId: null,
      tempConnection: null 
    })
    setContextMenu(null)
  }

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (tempConnection && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      // Converter coordenadas para o sistema do canvas
      const canvasCoords = screenToCanvas('notes', e.clientX - rect.left, e.clientY - rect.top, rect)
      updateTempConnection(canvasCoords.x, canvasCoords.y)
    }
  }, [tempConnection, updateTempConnection, screenToCanvas])

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (tempConnection) {
      const target = e.target as HTMLElement
      const connectionPoint = target.closest('[data-connection-point]') as HTMLElement
      
      if (connectionPoint) {
        const noteId = connectionPoint.dataset.noteId
        const pointType = connectionPoint.dataset.pointType
        
        if (noteId && noteId !== tempConnection.fromNoteId) {
          completeConnection(noteId)
        } else {
          // Cancelar conexão se clicou na mesma nota
          useNotesStore.setState({ tempConnection: null })
        }
      } else {
        // Cancelar conexão se clicou em lugar nenhum
        useNotesStore.setState({ tempConnection: null })
      }
    }
  }, [tempConnection, completeConnection])

  const menuOptions = [
    { label: 'Adicionar Nota', action: handleAddNote, icon: '📝' },
    { label: 'Limpar Todas as Notas', action: handleClearAllNotes, icon: '🗑️' },
  ]

  // Calcular pontos para a conexão temporária
  const getTempConnectionPath = () => {
    if (!tempConnection) return ''
    
    const fromNote = notes.find(n => n.id === tempConnection.fromNoteId)
    if (!fromNote) return ''

    const startX = fromNote.x + fromNote.width
    const startY = fromNote.y + fromNote.height / 2
    const endX = tempConnection.x
    const endY = tempConnection.y

    const midX = (startX + endX) / 2
    const curveIntensity = 50

    return `M ${startX} ${startY} C ${midX} ${startY - curveIntensity} ${midX} ${endY + curveIntensity} ${endX} ${endY}`
  }

  return (
    <>
      <Container 
        ref={containerRef}
        $isDragging={false} 
        onContextMenu={handleCanvasContextMenu}
        onMouseDown={handleCanvasMouseDown}
      >
        <Canvas id='notes'>
          <NotesContainer
            ref={canvasContainerRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            data-canvas-container="true"
          >
            {/* SVG para conexões - deve vir antes das notas para ficar atrás */}
            <ConnectionsSVG>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#007bff" />
                </marker>
              </defs>

              {/* Conexões permanentes */}
              {connections.map((connection) => (
                <Connection key={connection.id} connection={connection} />
              ))}

              {/* Conexão temporária */}
              {tempConnection && (
                <TempConnection
                  d={getTempConnectionPath()}
                  stroke="#dc3545"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  fill="none"
                />
              )}
            </ConnectionsSVG>

            {/* Notas */}
            {notes.map((note) => (
              <NoteWrapper key={note.id}>
                <Note note={note} canvasId="notes" />
              </NoteWrapper>
            ))}

            <Grid />
          </NotesContainer>
        </Canvas>
      </Container>

      {contextMenu && (
        <ContextMenuWrapper
          ref={contextMenuRef}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <ContextMenu>
            {menuOptions.map((option, index) => (
              <ContextMenuItem key={index} onClick={option.action}>
                <ContextMenuIcon>{option.icon}</ContextMenuIcon>
                {option.label}
              </ContextMenuItem>
            ))}
          </ContextMenu>
        </ContextMenuWrapper>
      )}
    </>
  )
}

const Container = styled.div<{ $isDragging?: boolean }>`
  flex: 1;
  height: 100%;
  background-color: ${(props) => props.theme.colors.card};
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  overflow: hidden;
  position: relative;
  cursor: ${(props) => (props.$isDragging ? 'grabbing' : 'grab')};

  &:active {
    cursor: grabbing;
  }
`;

const Grid = styled.div`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  background-position: center center;
  opacity: 0.6;
  pointer-events: none;
  z-index: 0;
`;

const NotesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const ConnectionsSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`

const TempConnection = styled.path`
  stroke: #dc3545;
  stroke-width: 2;
  stroke-dasharray: 5, 5;
  fill: none;
  pointer-events: none;
`

const NoteWrapper = styled.div`
  position: absolute;
  z-index: 2;
`

// Context Menu Styles
const ContextMenuWrapper = styled.div`
  position: fixed;
  z-index: 1000;
  pointer-events: auto;
  left: 0;
  top: 0;
`

const ContextMenu = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 8px;
  min-width: 200px;
`

const ContextMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #1f2937;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
  }
`

const ContextMenuIcon = styled.span`
  font-size: 16px;
  width: 20px;
  text-align: center;
`