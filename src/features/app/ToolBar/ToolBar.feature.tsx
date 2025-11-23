import styled from "styled-components";
import { useState } from "react";

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
        {currentView === 'ficha' && <FichaScreen />}
        {currentView === 'inventario' && <InventarioScreen />}
        {currentView === 'notas' && <NotasScreen />}
      </ToolContent>
    </Container>
  );
};

// Componentes para as telas das funcionalidades
const FichaScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <h4>Ficha do Personagem</h4>
      <p>Aqui você pode visualizar e editar a ficha do seu personagem.</p>
      <InfoBox>
        <InfoItem>
          <strong>Nome:</strong> Personagem Exemplo
        </InfoItem>
        <InfoItem>
          <strong>Classe:</strong> Guerreiro
        </InfoItem>
        <InfoItem>
          <strong>Nível:</strong> 1
        </InfoItem>
      </InfoBox>
    </ScreenContainer>
  );
};

const InventarioScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <h4>Inventário</h4>
      <p>Gerencie os itens do seu personagem.</p>
      <ItemList>
        <Item>Espada Longa</Item>
        <Item>Poção de Cura</Item>
        <Item>Armadura de Couro</Item>
        <Item>10 po de ouro</Item>
      </ItemList>
    </ScreenContainer>
  );
};

const NotasScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <h4>Notas</h4>
      <p>Anotações pessoais sobre a campanha.</p>
      <NotesTextarea placeholder="Digite suas anotações aqui..." />
    </ScreenContainer>
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

const ScreenContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoBox = styled.div`
  background-color: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 16px;
`;

const InfoItem = styled.div`
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Item = styled.div`
  background-color: #F3F4F6;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
`;

const NotesTextarea = styled.textarea`
  flex: 1;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  padding: 12px;
  font-family: inherit;
  font-size: 14px;
  resize: none;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;