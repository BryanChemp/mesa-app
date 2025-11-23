import styled from "styled-components";

interface PlayersProps {
  players?: Array<{
    id: string;
    name: string;
    isMaster?: boolean;
    currentHp?: number;
    maxHp?: number;
    buffs?: string[];
    debuffs?: string[];
  }>;
}

export const Players: React.FC<PlayersProps> = ({ players = [] }) => {
  const defaultPlayers = [
    { id: '1', name: 'Jogador 1', currentHp: 8, maxHp: 10, buffs: ['💪', '🛡️'], debuffs: [] },
    { id: '2', name: 'Jogador 2', currentHp: 10, maxHp: 10, buffs: ['🔥'], debuffs: ['❄️'] },
    { id: '3', name: 'Jogador 3', currentHp: 3, maxHp: 12, buffs: [], debuffs: ['💀', '🌀'] },
    { id: '4', name: 'Mestre', isMaster: true, currentHp: 15, maxHp: 15, buffs: ['👁️'], debuffs: [] },
    { id: '5', name: 'Jogador 4', currentHp: 5, maxHp: 8, buffs: ['⚡'], debuffs: ['🕸️'] },
    { id: '6', name: 'Jogador 5', currentHp: 12, maxHp: 12, buffs: ['✨', '🌟'], debuffs: [] },
    { id: '7', name: 'Jogador 6', currentHp: 7, maxHp: 9, buffs: [], debuffs: ['🔴'] },
    { id: '8', name: 'Jogador 7', currentHp: 0, maxHp: 10, buffs: [], debuffs: ['💀'] },
  ];

  const playersToShow = players.length > 0 ? players : defaultPlayers;

  return (
    <Container>
      <ScrollContainer>
        {playersToShow.map(player => (
          <PlayerCard key={player.id}>
            {/* Primeira linha: Ícone e Nome */}
            <FirstRow>
              <Icon>🧙</Icon>
              <Name master={player.isMaster}>
                {player.name}
                {player.isMaster && <MasterBadge>M</MasterBadge>}
              </Name>
            </FirstRow>
            
            {/* Segunda linha: Ícone e Barra de Vida */}
            <SecondRow>
              <Icon>❤️</Icon>
              <HealthBar>
                <HealthText>
                  {player.currentHp}/{player.maxHp}
                </HealthText>
                <BarContainer>
                  <HealthFill 
                    percentage={(player.currentHp || 0) / (player.maxHp || 1) * 100}
                    critical={player.currentHp === 0}
                  />
                </BarContainer>
              </HealthBar>
            </SecondRow>
            
            {/* Terceira linha: Buffs e Debuffs */}
            <ThirdRow>
              <Spacer />
              <StatusContainer>
                <Buffs>
                  {player.buffs?.map((buff, index) => (
                    <StatusIcon key={index} type="buff">{buff}</StatusIcon>
                  ))}
                </Buffs>
                <Debuffs>
                  {player.debuffs?.map((debuff, index) => (
                    <StatusIcon key={index} type="debuff">{debuff}</StatusIcon>
                  ))}
                </Debuffs>
              </StatusContainer>
            </ThirdRow>
          </PlayerCard>
        ))}
      </ScrollContainer>
    </Container>
  );
};

const Container = styled.div`
  height: 150px;
  min-height: 150px;
  background-color: transparent;
  padding: 12px;
  overflow: hidden;
  flex-shrink: 0;
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 12px;
  height: 100%;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  
  /* Scrollbar transparente */
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const PlayerCard = styled.div`
  min-width: 180px;
  height: 120px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
`;

const FirstRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SecondRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ThirdRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Icon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const Name = styled.div<{ master?: boolean }>`
  font-weight: bold;
  font-size: 14px;
  color: ${props => props.master ? props.theme.colors.secondary : props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MasterBadge = styled.span`
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: bold;
`;

const HealthBar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const HealthText = styled.div`
  font-size: 11px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const BarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  overflow: hidden;
`;

const HealthFill = styled.div<{ percentage: number; critical?: boolean }>`
  width: ${props => props.percentage}%;
  height: 100%;
  background-color: ${props => {
    if (props.critical) return props.theme.colors.error;
    if (props.percentage < 30) return props.theme.colors.warning;
    return props.theme.colors.success;
  }};
  border-radius: 3px;
  transition: all 0.3s ease;
`;

const Spacer = styled.div`
  width: 24px;
`;

const StatusContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Buffs = styled.div`
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
`;

const Debuffs = styled.div`
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
`;

const StatusIcon = styled.span<{ type: 'buff' | 'debuff' }>`
  font-size: 12px;
  padding: 1px;
  border-radius: 2px;
  background-color: ${props => 
    props.type === 'buff' 
      ? 'rgba(52, 211, 153, 0.2)' 
      : 'rgba(239, 68, 68, 0.2)'
  };
`;