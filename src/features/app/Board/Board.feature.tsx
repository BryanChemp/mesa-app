import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import Canvas from '../Canvas/Canvas'
import { DiceScene } from '../../../shared/components/Dice/Dice'

export const Board: React.FC = () => {
  const [diceKey, setDiceKey] = useState(0);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [roll, setRoll] = useState(false)
  const [diceResult, setDiceResult] = useState<number | null>(null)
  const [showPanel, setShowPanel] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const testElements = [
    { id: 1, x: 100, y: 100, size: 50, color: '#5A7DFE', label: 'Elemento 1' },
    { id: 2, x: 300, y: 200, size: 70, color: '#A78BFA', label: 'Elemento 2' },
    { id: 3, x: 500, y: 150, size: 40, color: '#34D399', label: 'Elemento 3' },
    { id: 4, x: 200, y: 300, size: 60, color: '#FBBF24', label: 'Elemento 4' },
    { id: 5, x: 400, y: 400, size: 80, color: '#EF4444', label: 'Elemento 5' },
    { id: 6, x: 600, y: 250, size: 55, color: '#10B981', label: 'Elemento 6' },
  ]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenu && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setContextMenu(null)
      }
    }

    const handleGlobalContextMenu = (e: MouseEvent) => {
      if (containerRef.current && containerRef.current.contains(e.target as Node)) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('contextmenu', handleGlobalContextMenu)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('contextmenu', handleGlobalContextMenu)
    }
  }, [contextMenu])

  const handleBoardContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setContextMenu({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleBoardMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && contextMenu) {
      setContextMenu(null)
    }

    if (e.button === 2) {
      if (!contextMenu) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  }

  const handleRollD20 = () => {
    setRoll(true)
    setDiceResult(null)
    setContextMenu(null)
    setShowPanel(true)
    setDiceKey(prev => prev + 1)
    console.log("asfg,asmgfas")
  }

  const menuOptions = [
    { label: 'Rolar D20', action: handleRollD20, icon: '🎲' },
    { label: 'Adicionar Token', action: () => console.log('Adicionar token'), icon: '➕' },
    { label: 'Medir Distância', action: () => console.log('Medir distância'), icon: '📏' },
    { label: 'Limpar Board', action: () => console.log('Limpar board'), icon: '🗑️' },
  ]

  return (
    <>
      <Container 
        ref={containerRef} 
        $isDragging={false} 
        onContextMenu={handleBoardContextMenu} 
        onMouseDown={handleBoardMouseDown}
      >
        <Canvas>
          <Grid />

          {testElements.map((element) => (
            <TestElement
              key={element.id}
              style={{
                left: element.x,
                top: element.y,
                width: element.size,
                height: element.size,
                backgroundColor: element.color,
              }}
            >
              <span>{element.label}</span>
            </TestElement>
          ))}

          <CenterPoint />
        </Canvas>

        {showPanel && (
          <FloatingPanel>
            <PanelHeader>
              <span>Dado</span>
              <CloseBtn onClick={() => setShowPanel(false)}>×</CloseBtn>
            </PanelHeader>

            <PanelBody>
              <DiceMiniContainer key={diceKey}>
                <DiceScene
                  roll={roll}
                  diceCount={6}
                  diceType={6}
                  onResult={(n) => {
                    console.log("dice result", n)
                    setDiceResult(n)
                    setRoll(false)
                  }}
                />
              </DiceMiniContainer>


              {diceResult !== null && <ResultNumber>{diceResult}</ResultNumber>}
            </PanelBody>
          </FloatingPanel>
        )}
      </Container>

      {contextMenu && (
        <ContextMenuWrapper
          style={{ left: contextMenu.x, top: contextMenu.y }}
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

// ---------------- Styled Components ----------------

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
`

const Grid = styled.div`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  background-position: center center;
  opacity: 0.6;
`

const TestElement = styled.div`
  position: absolute;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.1s ease;

  span {
    background: rgba(0, 0, 0, 0.7);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
  }
`

const CenterPoint = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: #ef4444;
  border-radius: 50%;
  transform: translate(-50%, -50%);
`

const FloatingPanel = styled.div`
  position: absolute;
  left: 20px;
  top: 20px;
  width: 220px;
  background: #23252b;
  border: 1px solid #444;
  border-radius: 10px;
  z-index: 200000;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.4);
  overflow: hidden;
`

const PanelHeader = styled.div`
  background: #2b2e35;
  padding: 10px 14px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
`

const CloseBtn = styled.div`
  cursor: pointer;
  font-size: 20px;
  line-height: 16px;
  padding: 0 4px;
  color: #ccc;
  &:hover {
    color: white;
  }
`

const PanelBody = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`

const DiceMiniContainer = styled.div`
  width: 160px;
  height: 160px;
`

const ResultNumber = styled.div`
  color: white;
  font-size: 40px;
  text-align: center;
`

const ContextMenuWrapper = styled.div`
  position: absolute;
  z-index: 1000;
  pointer-events: auto;
`

const ContextMenu = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 8px;
  min-width: 200px;
  transform: translate(-50%, 10px);
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