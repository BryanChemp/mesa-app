import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface CharacterField {
  label: string;
  value: string;
  bonus?: string; // Nova propriedade opcional
}

interface CharacterSheetProps {
  characterId: string;
}

export const CharacterSheet = ({ characterId }: CharacterSheetProps) => {
  const [characterData, setCharacterData] = useState<CharacterField[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const simulateFetch = async (id: string): Promise<CharacterField[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mockData: { [key: string]: CharacterField[] } = {
          '1': [
            { label: 'Nome', value: 'Aragorn' },
            { label: 'Raça', value: 'Humano' },
            { label: 'Classe', value: 'Ranger' },
            { label: 'Nível', value: '10' },
            { label: 'Força', value: '18', bonus: '+4' },
            { label: 'Destreza', value: '16', bonus: '+3' },
            { label: 'Constituição', value: '15', bonus: '+2' },
            { label: 'Inteligência', value: '14', bonus: '+2' },
            { label: 'Sabedoria', value: '17', bonus: '+3' },
            { label: 'Carisma', value: '16', bonus: '+3' },
            { label: 'Pontos de Vida', value: '85' },
            { label: 'Classe de Armadura', value: '16' },
            { label: 'Percepção Passiva', value: '15', bonus: '+5' },
            { label: 'Investigação', value: '12', bonus: '+1' },
            { label: 'Arcana', value: '8', bonus: '-1' },
            { label: 'Religião', value: '10', bonus: '+0' },
            { label: 'História', value: '13', bonus: '+1' }
          ],
          '2': [
            { label: 'Nome', value: 'Gandalf' },
            { label: 'Raça', value: 'Maia' },
            { label: 'Classe', value: 'Mago' },
            { label: 'Nível', value: '20' },
            { label: 'Força', value: '10', bonus: '+0' },
            { label: 'Destreza', value: '12', bonus: '+1' },
            { label: 'Constituição', value: '14', bonus: '+2' },
            { label: 'Inteligência', value: '20', bonus: '+5' },
            { label: 'Sabedoria', value: '18', bonus: '+4' },
            { label: 'Carisma', value: '16', bonus: '+3' },
            { label: 'Pontos de Vida', value: '120' },
            { label: 'Classe de Armadura', value: '12' },
            { label: 'Percepção Passiva', value: '16', bonus: '+6' },
            { label: 'Investigação', value: '18', bonus: '+8' },
            { label: 'Arcana', value: '20', bonus: '+10' },
            { label: 'Religião', value: '19', bonus: '+9' },
            { label: 'História', value: '20', bonus: '+10' }
          ]
        };

        const data = mockData[id];
        if (data) {
          resolve(data);
        } else {
          reject(new Error('Personagem não encontrado'));
        }
      }, 1000);
    });
  };

  useEffect(() => {
    const loadCharacterData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await simulateFetch(characterId);
        setCharacterData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar personagem');
      } finally {
        setLoading(false);
      }
    };

    loadCharacterData();
  }, [characterId]);

  // Função para determinar a cor baseada no bônus
  const getBonusColor = (bonus: string) => {
    if (bonus.startsWith('-')) {
      return '#dc3545'; // Vermelho para negativo
    } else if (bonus.startsWith('+')) {
      return '#28a745'; // Verde para positivo
    } else {
      return '#6c757d'; // Cinza para neutro (como '+0')
    }
  };

  if (loading) {
    return <LoadingState>Carregando ficha do personagem...</LoadingState>;
  }

  if (error) {
    return <ErrorState>Erro: {error}</ErrorState>;
  }

  if (!characterData || characterData.length === 0) {
    return <EmptyState>Nenhum dado encontrado para este personagem.</EmptyState>;
  }

  return (
    <SheetContainer>
      <SheetGrid>
        {characterData.map((field, index) => (
          <Field key={index}>
            <FieldLabel>{field.label}</FieldLabel>
            <FieldValue>
              <ValueText>{field.value}</ValueText>
              {field.bonus && (
                <BonusValue color={getBonusColor(field.bonus)}>
                  ({field.bonus})
                </BonusValue>
              )}
            </FieldValue>
          </Field>
        ))}
      </SheetGrid>
    </SheetContainer>
  );
};

// Styled Components
const SheetContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const SheetGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
`;

const Field = styled.div`
  flex: 1 1 200px;
  min-width: 200px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex: 1 1 100%;
    min-width: 100%;
  }

  @media (min-width: 1200px) {
    flex: 1 1 180px;
    min-width: 180px;
  }
`;

const FieldLabel = styled.label`
  display: block;
  font-weight: bold;
  font-size: 14px;
  color: #495057;
  margin-bottom: 8px;
  text-transform: capitalize;
`;

const FieldValue = styled.div`
  font-size: 16px;
  color: #212529;
  padding: 8px 12px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const ValueText = styled.span`
  flex: 1;
`;

const BonusValue = styled.span<{ color: string }>`
  color: ${props => props.color};
  font-weight: bold;
  font-size: 14px;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #d32f2f;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
`;