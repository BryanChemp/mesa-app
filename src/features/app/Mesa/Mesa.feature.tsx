import React from 'react';
import styled from 'styled-components';
import { Board } from '../Board/Board.feature';
import { ToolBar } from '../ToolBar/ToolBar.feature';
import { Players } from '../Players/Players.feature';

export const Mesa: React.FC = () => {
  return (
    <Container>
      <MesaContainer>
        <LeftColumn>
          <BoardContainer>
            <Board />
            <PlayersOverlay>
              <Players />
            </PlayersOverlay>
          </BoardContainer>
        </LeftColumn>
        <RightColumn>
          <ToolBar isMaster={false} />
        </RightColumn>  
      </MesaContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const MesaContainer = styled.div`
  display: flex;
  flex: 1;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
`;

const LeftColumn = styled.div`
  flex: 6;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  overflow: hidden;
`;

const RightColumn = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  overflow: hidden;
`;

const BoardContainer = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

const PlayersOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 16px;
`;