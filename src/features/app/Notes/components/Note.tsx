// components/Notes/components/Note.tsx
import React, { useState, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { useNotesStore } from '../../../../stores/useNoteStore'
import { useCanvasStore } from '../../../../stores/useCanvasStore'

interface NoteProps {
  note: {
    id: string
    x: number
    y: number
    width: number
    height: number
    content: string
    color: string
  }
  canvasId: string
}

export const Note: React.FC<NoteProps> = ({ note, canvasId }) => {
  const {
    selectedNoteId,
    editingNoteId,
    updateNote,
    deleteNote,
    selectNote,
    startEditing,
    stopEditing,
    startConnection
  } = useNotesStore()

  const { screenToCanvas } = useCanvasStore()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const noteRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const isSelected = selectedNoteId === note.id
  const isEditing = editingNoteId === note.id

  // Handlers para arrastar a nota - CORRIGIDO
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Apenas botão esquerdo
    
    e.stopPropagation()
    selectNote(note.id)
    
    const containerRect = noteRef.current?.closest('[data-canvas-container]')?.getBoundingClientRect()
    if (!containerRect || !noteRef.current) return

    // Converter coordenadas do mouse para coordenadas do canvas
    const mouseCanvasCoords = screenToCanvas(
      canvasId, 
      e.clientX - containerRect.left, 
      e.clientY - containerRect.top, 
      containerRect
    )

    // Calcular offset relativo à posição da nota no canvas
    setDragOffset({
      x: mouseCanvasCoords.x - note.x,
      y: mouseCanvasCoords.y - note.y
    })
    setIsDragging(true)
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !noteRef.current) return

    const containerRect = noteRef.current.closest('[data-canvas-container]')?.getBoundingClientRect()
    if (!containerRect) return

    // Converter coordenadas da tela para coordenadas do canvas
    const canvasCoords = screenToCanvas(
      canvasId, 
      e.clientX - containerRect.left, 
      e.clientY - containerRect.top, 
      containerRect
    )

    // Calcular nova posição baseada no offset
    const newX = canvasCoords.x - dragOffset.x
    const newY = canvasCoords.y - dragOffset.y

    // Atualizar posição da nota IMEDIATAMENTE
    updateNote(note.id, { 
      x: newX, 
      y: newY 
    })
  }, [isDragging, dragOffset, note.id, updateNote, screenToCanvas, canvasId])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Event listeners para arrastar
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    startEditing(note.id)
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNote(note.id, { content: e.target.value })
    
    // Auto-expandir a textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, 2000)
      textareaRef.current.style.height = `${newHeight}px`
      
      // Atualizar a altura da nota se estiver editando
      if (newHeight > note.height) {
        updateNote(note.id, { height: newHeight })
      }
    }
  }

  const handleBlur = () => {
    stopEditing()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteNote(note.id)
  }

  const handleConnectStart = (e: React.MouseEvent, pointType: 'left' | 'right') => {
    e.stopPropagation()
    
    if (!noteRef.current) return
    
    const containerRect = noteRef.current.closest('[data-canvas-container]')?.getBoundingClientRect()
    if (!containerRect) return

    // Calcular posição do ponto de conexão relativa ao canvas
    const pointX = pointType === 'left' ? note.x : note.x + note.width
    const pointY = note.y + note.height / 2

    // Converter para coordenadas da tela (para a conexão temporária)
    const screenX = containerRect.left + pointX
    const screenY = containerRect.top + pointY
    
    startConnection(note.id, screenX, screenY)
  }

  // Calcular posições dos pontos de conexão
  const leftConnectionPoint = { x: -12, y: note.height / 2 }
  const rightConnectionPoint = { x: note.width, y: note.height / 2 }

  return (
    <NoteContainer
      ref={noteRef}
      $x={note.x}
      $y={note.y}
      $width={note.width}
      $height={note.height}
      $color={note.color}
      $isSelected={isSelected}
      $isDragging={isDragging}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      data-note-id={note.id}
    >
      {/* Pontos de conexão */}
      <ConnectionPoint
        $x={leftConnectionPoint.x}
        $y={leftConnectionPoint.y}
        data-connection-point="true"
        data-note-id={note.id}
        data-point-type="left"
        onMouseDown={(e) => handleConnectStart(e, 'left')}
        title="Conectar da esquerda"
      />
      
      <ConnectionPoint
        $x={rightConnectionPoint.x}
        $y={rightConnectionPoint.y}
        data-connection-point="true"
        data-note-id={note.id}
        data-point-type="right"
        onMouseDown={(e) => handleConnectStart(e, 'right')}
        title="Conectar da direita"
      />

      {/* Conteúdo da nota */}
      {isEditing ? (
        <NoteTextarea
          ref={textareaRef}
          value={note.content}
          onChange={handleContentChange}
          onBlur={handleBlur}
          $height={note.height}
          autoFocus
        />
      ) : (
        <NoteContent $height={note.height}>{note.content}</NoteContent>
      )}
      
      <NoteControls>
        <DeleteButton onClick={handleDelete} title="Deletar nota">
          ×
        </DeleteButton>
      </NoteControls>
    </NoteContainer>
  )
}

const NoteContainer = styled.div<{
  $x: number
  $y: number
  $width: number
  $height: number
  $color: string
  $isSelected: boolean
  $isDragging: boolean
}>`
  position: absolute;
  left: ${(props) => props.$x}px;
  top: ${(props) => props.$y}px;
  width: ${(props) => props.$width}px;
  min-height: ${(props) => props.$height}px;
  background: ${(props) => props.$color};
  border: 2px solid ${(props) => (props.$isSelected ? '#007bff' : 'transparent')};
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: ${(props) => (props.$isDragging ? 'grabbing' : 'grab')};
  transition: transform 0.1s ease;
  user-select: none;
  overflow: visible; /* Removido overflow: hidden */

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`

const ConnectionPoint = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${(props) => props.$x - 6}px;
  top: ${(props) => props.$y - 6}px;
  width: 20px;
  height: 20px;
  background: #007bff;
  border: 2px solid white;
  border-radius: 50%;
  cursor: crosshair;
  opacity: 0;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  ${NoteContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    transform: scale(1.2);
    background: #0056b3;
  }
`

const NoteContent = styled.div<{ $height: number }>`
  width: 100%;
  min-height: ${(props) => props.$height}px;
  overflow: visible; /* Removido overflow */
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.4;
  color: #333;
  white-space: pre-wrap; /* Manter quebras de linha */
`

const NoteTextarea = styled.textarea<{ $height: number }>`
  width: 100%;
  min-height: ${(props) => props.$height}px;
  max-height: 1000px;
  border: none;
  background: transparent;
  resize: none;
  outline: none;
  font-size: 14px;
  line-height: 1.4;
  font-family: inherit;
  color: #333;
  overflow: ${(props) => props.$height >= 2000 ? 'auto' : 'hidden'}; /* Scroll só no máximo */
  white-space: pre-wrap; /* Manter quebras de linha */

  /* Auto-expand behavior */
  &:focus {
    overflow: ${(props) => props.$height >= 2000 ? 'auto' : 'hidden'};
  }
`

const NoteControls = styled.div`
  position: absolute;
  top: -25px;
  right: 0;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${NoteContainer}:hover & {
    opacity: 1;
  }
`

const DeleteButton = styled.button`
  background: #dc3545;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #c82333;
  }
`