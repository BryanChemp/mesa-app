import React from 'react';
import styled from 'styled-components';
import { useCanvasNavigation } from './hooks/useCanvasNavigation';

export const Board: React.FC = () => {
  const {
    zoom,
    position,
    isDragging,
    containerRef,
    handleMouseDown,
    resetView,
  } = useCanvasNavigation();

  const testElements = [
    { id: 1, x: 100, y: 100, size: 50, color: '#5A7DFE', label: 'Elemento 1' },
    { id: 2, x: 300, y: 200, size: 70, color: '#A78BFA', label: 'Elemento 2' },
    { id: 3, x: 500, y: 150, size: 40, color: '#34D399', label: 'Elemento 3' },
    { id: 4, x: 200, y: 300, size: 60, color: '#FBBF24', label: 'Elemento 4' },
    { id: 5, x: 400, y: 400, size: 80, color: '#EF4444', label: 'Elemento 5' },
    { id: 6, x: 600, y: 250, size: 55, color: '#10B981', label: 'Elemento 6' },
  ];

  return (
    <Container 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      $isDragging={isDragging}
    >
      <CanvasContainer 
        style={{ 
          transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: 'center center'
        }}
      >
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
      </CanvasContainer>

      <Controls>
        <ZoomIndicator>
          Zoom: {(zoom * 100).toFixed(0)}%
        </ZoomIndicator>
        <PositionIndicator>
          Pos: {position.x.toFixed(0)}, {position.y.toFixed(0)}
        </PositionIndicator>
        <ResetButton onClick={resetView}>
          Resetar Vista
        </ResetButton>
      </Controls>
    </Container>
  );
};

const Container = styled.div<{ $isDragging: boolean }>`
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

const CanvasContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  transition: transform 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
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

const Controls = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
`;

const ZoomIndicator = styled.div`
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
`;

const PositionIndicator = styled.div`
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
`;

const ResetButton = styled.button`
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;