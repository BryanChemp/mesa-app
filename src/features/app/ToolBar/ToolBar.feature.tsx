import styled from "styled-components";

interface ToolBarComponentProps {
  isMaster?: boolean;
}

export const ToolBar: React.FC<ToolBarComponentProps> = ({ isMaster = false }) => {
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
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {isMaster ? (
          <>
            <ToolBarButton>Controle de NPCs</ToolBarButton>
            <ToolBarButton>Gerenciar Encontros</ToolBarButton>
            <ToolBarButton>Configurar Cenário</ToolBarButton>
            <ToolBarButton>Rolar Dados Secreto</ToolBarButton>
            <ToolBarButton>Gerenciar Itens</ToolBarButton>
          </>
        ) : (
          <>
            <ToolBarButton>Meu Personagem</ToolBarButton>
            <ToolBarButton>Rolar Dados</ToolBarButton>
            <ToolBarButton>Inventário</ToolBarButton>
            <ToolBarButton>Habilidades</ToolBarButton>
            <ToolBarButton>Configurações</ToolBarButton>
          </>
        )}
      </div>
    </Container>
  );
};

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

const ToolBarButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;