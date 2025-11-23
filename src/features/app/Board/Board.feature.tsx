import styled from "styled-components";

export const Board: React.FC = () => {
  return (
    <Container>
      <span style={{ color: '#6B7280', fontSize: '18px' }}>
        Área do Cenário - Personagens e Elementos do Mundo
      </span>
    </Container>
  );
};

const Container = styled.div`
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
`;