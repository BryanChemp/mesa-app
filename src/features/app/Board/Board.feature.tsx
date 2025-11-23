import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Canvas from '../Canvas/Canvas';

export const Board: React.FC = () => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const testElements = [
    { id: 1, x: 100, y: 100, size: 50, color: '#5A7DFE', label: 'Elemento 1' },
    { id: 2, x: 300, y: 200, size: 70, color: '#A78BFA', label: 'Elemento 2' },
    { id: 3, x: 500, y: 150, size: 40, color: '#34D399', label: 'Elemento 3' },
    { id: 4, x: 200, y: 300, size: 60, color: '#FBBF24', label: 'Elemento 4' },
    { id: 5, x: 400, y: 400, size: 80, color: '#EF4444', label: 'Elemento 5' },
    { id: 6, x: 600, y: 250, size: 55, color: '#10B981', label: 'Elemento 6' },
  ];

  // Fecha o menu quando clica fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenu && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [contextMenu]);

  const handleBoardContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Impede o menu de contexto padrão
    e.stopPropagation(); // Para a propagação do evento
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContextMenu({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleBoardMouseDown = (e: React.MouseEvent) => {
    // Se for clique direito, previne o comportamento padrão
    if (e.button === 2) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Fecha o menu se estiver aberto
    if (contextMenu) {
      setContextMenu(null);
    }
  };

  const handleRollD20 = () => {
    setIsRolling(true);
    setDiceResult(null);
    setContextMenu(null);

    setTimeout(() => {
      const result = Math.floor(Math.random() * 20) + 1;
      setDiceResult(result);
      setIsRolling(false);
    }, 2000);
  };

  const handleCloseDice = () => {
    setDiceResult(null);
  };

  const menuOptions = [
    { label: 'Rolar D20', action: handleRollD20, icon: '🎲' },
    { label: 'Adicionar Token', action: () => console.log('Adicionar token'), icon: '➕' },
    { label: 'Medir Distância', action: () => console.log('Medir distância'), icon: '📏' },
    { label: 'Limpar Board', action: () => console.log('Limpar board'), icon: '🗑️' },
  ];

  return (
    <>
      <Container 
        ref={containerRef}
        $isDragging={false}
        onContextMenu={handleBoardContextMenu} // Usa a função específica
        onMouseDown={handleBoardMouseDown} // Usa a função específica
      >
        <Canvas>
          <Grid />
          
          {testElements.map(element => (
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

          {/* Overlay do Dado - ainda dentro do Canvas para poder usar transformações */}
          {(isRolling || diceResult) && (
            <DiceOverlay onClick={handleCloseDice}>
              <DiceContainer $isRolling={isRolling}>
                <D20 $result={diceResult} $isRolling={isRolling}>
                  {diceResult && Array.from({ length: 20 }, (_, i) => (
                    <DiceFace key={i} $face={i + 1}>
                      {i + 1}
                    </DiceFace>
                  ))}
                </D20>
                
                {diceResult && (
                  <DiceResult>
                    <ResultNumber>{diceResult}</ResultNumber>
                    <ResultLabel>Resultado do D20</ResultLabel>
                    <CloseHint>Clique para fechar</CloseHint>
                  </DiceResult>
                )}
              </DiceContainer>
            </DiceOverlay>
          )}
        </Canvas>
      </Container>

      {/* Context Menu fora do Canvas - tamanho fixo independente do zoom */}
      {contextMenu && (
        <ContextMenuWrapper style={{ left: contextMenu.x, top: contextMenu.y }}>
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
  );
};

// Styled Components

const Container = styled.div<{ $isDragging?: boolean }>`
  flex: 1;
  height: 100%;
  background-color: ${props => props.theme.colors.card};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  overflow: hidden;
  position: relative;
  cursor: ${props => props.$isDragging ? 'grabbing' : 'grab'};
  
  &:active {
    cursor: grabbing;
  }
`;

// Wrapper para posicionamento absoluto relativo ao container do Board
const ContextMenuWrapper = styled.div`
  position: absolute;
  z-index: 1000;
  pointer-events: auto;
`;

// Context Menu com tamanho fixo - não é afetado pelo zoom do Canvas
const ContextMenu = styled.div`
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 8px;
  min-width: 200px;
  transform: translate(-50%, 10px); /* Centraliza e dá um espaçamento */
`;

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
  color: #1F2937;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #F3F4F6;
  }
`;

const ContextMenuIcon = styled.span`
  font-size: 16px;
  width: 20px;
  text-align: center;
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
`;

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
`;

const CenterPoint = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: #EF4444;
  border-radius: 50%;
  transform: translate(-50%, -50%);
`;

const DiceOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  cursor: pointer;
`;

const spin = keyframes`
  0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  100% { transform: rotateX(720deg) rotateY(360deg) rotateZ(180deg); }
`;

const DiceContainer = styled.div<{ $isRolling: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const D20 = styled.div<{ $result: number | null; $isRolling: boolean }>`
  width: 120px;
  height: 120px;
  position: relative;
  transform-style: preserve-3d;
  animation: ${props => props.$isRolling ? spin : 'none'} 2s ease-in-out;
  transform: ${props => props.$result ? `rotateX(${(props.$result - 1) * 18}deg) rotateY(${(props.$result - 1) * 36}deg)` : 'none'};
  transition: ${props => !props.$isRolling ? 'transform 0.5s ease-out' : 'none'};
`;

const DiceFace = styled.div<{ $face: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  backface-visibility: hidden;

  transform: ${props => {
    const angle = (props.$face - 1) * 36;
    return `rotateY(${angle}deg) rotateX(${(props.$face - 1) * 18}deg) translateZ(60px)`;
  }};
`;

const DiceResult = styled.div`
  text-align: center;
  color: white;
`;

const ResultNumber = styled.div`
  font-size: 48px;
  font-weight: bold;
  color: #FBBF24;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const ResultLabel = styled.div`
  font-size: 18px;
  margin-top: 8px;
  opacity: 0.9;
`;

const CloseHint = styled.div`
  font-size: 12px;
  margin-top: 16px;
  opacity: 0.7;
`;