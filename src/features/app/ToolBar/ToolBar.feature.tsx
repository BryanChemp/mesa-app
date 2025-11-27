import styled from "styled-components";
import { useState } from "react";
import { CharacterSheet } from "../CharacterSheet/CharacterSheet";
import { Inventory } from "../Inventory/Inventory";
import { Notes } from "../Notes/Notes";

interface ToolBarComponentProps {
  isMaster?: boolean;
}

type ToolView = 'main' | 'ficha' | 'inventario' | 'notas';

export const ToolBar: React.FC<ToolBarComponentProps> = ({ isMaster = false }) => {
  const [currentView, setCurrentView] = useState<ToolView>('main');

  const handleToolClick = (tool: ToolView) => {
    setCurrentView(tool);
  };

  const handleBack = () => {
    setCurrentView('main');
  };

  if (currentView === 'main') {
    return (
      <Container>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          color: '#1F2937',
          borderBottom: '2px solid #E5E7EB',
          paddingBottom: '8px'
        }}>
          {isMaster ? 'Ferramentas do Mestre' : 'Ferramentas do Jogador'}
        </h3>
        
        <ToolList>
          <ToolListItem onClick={() => handleToolClick('ficha')}>
            <ToolInfo>
              <ToolIcon>📄</ToolIcon>
              <ToolLabel>Ficha</ToolLabel>
            </ToolInfo>
            <Chevron>›</Chevron>
          </ToolListItem>
          
          <ToolListItem onClick={() => handleToolClick('inventario')}>
            <ToolInfo>
              <ToolIcon>🎒</ToolIcon>
              <ToolLabel>Inventário</ToolLabel>
            </ToolInfo>
            <Chevron>›</Chevron>
          </ToolListItem>
          
          <ToolListItem onClick={() => handleToolClick('notas')}>
            <ToolInfo>
              <ToolIcon>📝</ToolIcon>
              <ToolLabel>Notas</ToolLabel>
            </ToolInfo>
            <Chevron>›</Chevron>
          </ToolListItem>
        </ToolList>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>← Voltar</BackButton>
        <ToolTitle>
          {currentView === 'ficha' && 'Ficha do Personagem'}
          {currentView === 'inventario' && 'Inventário'}
          {currentView === 'notas' && 'Notas'}
        </ToolTitle>
      </Header>
      
      <ToolContent>
        {currentView === 'ficha' && <CharacterSheet characterId="1" />}
        {currentView === 'inventario' && <Inventory />}
        {currentView === 'notas' && <Notes />}
      </ToolContent>
    </Container>
  );
};


// Styled Components
const Container = styled.div`
  flex: 1;
  background-color: ${props => props.theme.colors.card};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
`;

const ToolList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ToolListItem = styled.button`
  background-color: white;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #F9FAFB;
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ToolInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ToolIcon = styled.div`
  font-size: 20px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ToolLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1F2937;
`;

const Chevron = styled.div`
  font-size: 18px;
  color: #6B7280;
  font-weight: bold;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  border-bottom: 2px solid #E5E7EB;
  padding-bottom: 12px;
`;

const BackButton = styled.button`
  background: none;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
  color: #6B7280;
  
  &:hover {
    background-color: #F3F4F6;
  }
`;

const ToolTitle = styled.h3`
  margin: 0;
  color: #1F2937;
  font-size: 16px;
`;

const ToolContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
