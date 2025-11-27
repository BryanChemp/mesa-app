import { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Item {
  id: string;
  name: string;
  width: number;
  height: number;
  weight: number;
  img: string;
  pos: { x: number; y: number };
}

interface InventoryData {
  icon?: string;
  name: string;
  max_weight: number;
  size: { width: number; height: number };
  items: Item[];
}

interface DragItem {
  type: string;
  item: Item;
  fromPos: { x: number; y: number };
  grabOffset?: { x: number; y: number };
}

const CELL_SIZE = 50;
const GRID_GAP = 0;

const DraggableItem = ({
  item,
  onMove,
  onHover
}: {
  item: Item;
  onMove: (item: Item, newX: number, newY: number) => void;
  onHover?: (item: Item, newX: number, newY: number) => void;
}) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'item',
    item: (monitor) => {
      const client = monitor.getClientOffset();
      const rect = nodeRef.current?.getBoundingClientRect();
      const grabOffset = client && rect ? { x: client.x - rect.left, y: client.y - rect.top } : { x: CELL_SIZE / 2, y: CELL_SIZE / 2 };
      return { type: 'item', item, fromPos: item.pos, grabOffset };
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  }), [item]);

  const [, drop] = useDrop(() => ({
    accept: 'item',
    drop: (draggedItem: DragItem) => {
      if (draggedItem.item.id !== item.id) {
        onMove(draggedItem.item, item.pos.x, item.pos.y);
      }
    }
  }), [item, onMove]);

  const left = (item.pos.x - 1) * CELL_SIZE;
  const top = (item.pos.y - 1) * CELL_SIZE;
  const width = item.width * CELL_SIZE;
  const height = item.height * CELL_SIZE;

  return (
    <Item
      ref={(node) => {
        nodeRef.current = node;
        drag(drop(node));
      }}
      style={{
        opacity: isDragging ? 0.5 : 1,
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`
      }}
      title={`${item.name}\nPeso: ${item.weight}kg`}
    >
      <ItemImage src={item.img} alt={item.name} />
      <ItemName>{item.name}</ItemName>
    </Item>
  );
};

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryData>({
    name: "Mochila do Aventureiro",
    max_weight: 100,
    size: { width: 8, height: 6 },
    items: [
      { id: '1', name: 'Poção de Cura', width: 2, height: 1, weight: 0.5, img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=100&h=50&fit=crop', pos: { x: 2, y: 1 } },
      { id: '2', name: 'Espada Longa', width: 1, height: 3, weight: 3.0, img: 'https://images.unsplash.com/photo-1586987177718-54e00866c9e0?w=50&h=150&fit=crop', pos: { x: 4, y: 1 } },
      { id: '3', name: 'Escudo de Aço', width: 2, height: 2, weight: 5.0, img: 'https://images.unsplash.com/photo-1570303344838-a30d0a0f7e13?w=100&h=100&fit=crop', pos: { x: 1, y: 3 } },
      { id: '4', name: 'Poção de Mana', width: 2, height: 1, weight: 0.5, img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=100&h=50&fit=crop', pos: { x: 5, y: 4 } }
    ]
  });

  const gridRef = useRef<HTMLDivElement | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const totalWeight = inventory.items.reduce((sum, item) => sum + item.weight, 0);

  const isPositionOccupied = useCallback((x: number, y: number, excludeItemId?: string) => {
    return inventory.items.some(item => {
      if (item.id === excludeItemId) return false;
      return x >= item.pos.x && x < item.pos.x + item.width && y >= item.pos.y && y < item.pos.y + item.height;
    });
  }, [inventory.items]);

  const canPlaceItem = useCallback((item: Item, newX: number, newY: number) => {
    if (newX < 1 || newY < 1 || newX + item.width - 1 > inventory.size.width || newY + item.height - 1 > inventory.size.height) {
      return false;
    }
    for (let x = newX; x < newX + item.width; x++) {
      for (let y = newY; y < newY + item.height; y++) {
        if (isPositionOccupied(x, y, item.id)) {
          return false;
        }
      }
    }
    return true;
  }, [inventory.size, isPositionOccupied]);

  const handleItemMove = (item: Item, newX: number, newY: number) => {
    if (canPlaceItem(item, newX, newY)) {
      setInventory(prev => ({
        ...prev,
        items: prev.items.map(i => i.id === item.id ? { ...i, pos: { x: newX, y: newY } } : i)
      }));
    }
  };

  const [, drop] = useDrop(() => ({
    accept: 'item',
    hover: (draggedItem: DragItem, monitor) => {
      const client = monitor.getClientOffset() || monitor.getSourceClientOffset();
      if (!client || !gridRef.current) return;
      const gridRect = gridRef.current.getBoundingClientRect();
      const grab = draggedItem.grabOffset || { x: CELL_SIZE / 2, y: CELL_SIZE / 2 };
      const topLeftPxX = client.x - gridRect.left - grab.x;
      const topLeftPxY = client.y - gridRect.top - grab.y;
      let x = Math.round(topLeftPxX / CELL_SIZE) + 1;
      let y = Math.round(topLeftPxY / CELL_SIZE) + 1;
      x = Math.max(1, Math.min(x, inventory.size.width - draggedItem.item.width + 1));
      y = Math.max(1, Math.min(y, inventory.size.height - draggedItem.item.height + 1));
      setHoverPos({ x, y, width: draggedItem.item.width, height: draggedItem.item.height });
    },
    drop: (draggedItem: DragItem) => {
      if (!hoverPos) return;
      handleItemMove(draggedItem.item, hoverPos.x, hoverPos.y);
      setHoverPos(null);
    }
  }), [inventory, hoverPos]);

  const findEmptyPosition = (width: number, height: number) => {
    for (let y = 1; y <= inventory.size.height - height + 1; y++) {
      for (let x = 1; x <= inventory.size.width - width + 1; x++) {
        let canPlace = true;
        for (let dx = 0; dx < width; dx++) {
          for (let dy = 0; dy < height; dy++) {
            if (isPositionOccupied(x + dx, y + dy)) { canPlace = false; break; }
          }
          if (!canPlace) break;
        }
        if (canPlace) return { x, y };
      }
    }
    return null;
  };

  const addTestItem = () => {
    const newItem: Item = { id: Date.now().toString(), name: 'Novo Item', width: 1, height: 1, weight: 1.0, img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=50&h=50&fit=crop', pos: { x: 1, y: 1 } };
    const emptyPos = findEmptyPosition(newItem.width, newItem.height);
    if (emptyPos) { newItem.pos = emptyPos; setInventory(prev => ({ ...prev, items: [...prev.items, newItem] })); }
    else alert('Não há espaço disponível no inventário!');
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 1; y <= inventory.size.height; y++) {
      for (let x = 1; x <= inventory.size.width; x++) {
        cells.push(<GridCell key={`${x}-${y}`} />);
      }
    }
    return cells;
  };

  return (
    <InventoryContainer>
      <InventoryHeader>
        <InventoryName>{inventory.name}</InventoryName>
        <WeightInfo weightExceeded={totalWeight > inventory.max_weight}>
          Peso: {totalWeight.toFixed(1)} / {inventory.max_weight} kg{totalWeight > inventory.max_weight && ' ⚠️'}
        </WeightInfo>
      </InventoryHeader>

      <InventoryGridWrapper>
        <InventoryGrid
          ref={(node) => { gridRef.current = node; drop(node); }}
          columns={inventory.size.width}
          rows={inventory.size.height}
          cellSize={CELL_SIZE}
        >
          {renderGrid()}
          {inventory.items.map(item => <DraggableItem key={item.id} item={item} onMove={handleItemMove} />)}
          {hoverPos && <Placeholder style={{
            left: `${(hoverPos.x - 1) * CELL_SIZE}px`,
            top: `${(hoverPos.y - 1) * CELL_SIZE}px`,
            width: `${hoverPos.width * CELL_SIZE}px`,
            height: `${hoverPos.height * CELL_SIZE}px`
          }} />}
        </InventoryGrid>
      </InventoryGridWrapper>

      <InventoryActions>
        <AddButton onClick={addTestItem}>+ Adicionar Item de Teste</AddButton>
      </InventoryActions>

      <ItemList>
        <h3>Itens no Inventário ({inventory.items.length}):</h3>
        {inventory.items.map(item => (
          <ListItem key={item.id}>
            <ItemInfo>
              <SmallItemImage src={item.img} alt={item.name} />
              <span>{item.name}</span>
            </ItemInfo>
            <span>{item.weight}kg • {item.width}x{item.height}</span>
          </ListItem>
        ))}
      </ItemList>
    </InventoryContainer>
  );
};

const InventoryWithDnd = () => (
  <DndProvider backend={HTML5Backend}>
    <Inventory />
  </DndProvider>
);

const InventoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: ${CELL_SIZE * 8 + 40}px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background: #1a1a1a;
  border-radius: 12px;
`;

const InventoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  border-radius: 10px;
  border: 2px solid #4a6572;
`;

const InventoryName = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const WeightInfo = styled.div<{ weightExceeded?: boolean }>`
  font-size: 14px;
  color: ${props => props.weightExceeded ? '#ff6b6b' : '#ecf0f1'};
  font-weight: ${props => props.weightExceeded ? 'bold' : 'normal'};
`;

const InventoryGridWrapper = styled.div`
  background: #2c3e50;
  padding: 15px;
  border-radius: 10px;
  border: 3px solid #34495e;
  display: inline-block;
`;

const InventoryGrid = styled.div<{ columns: number; rows: number; cellSize: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, ${props => props.cellSize}px);
  grid-template-rows: repeat(${props => props.rows}, ${props => props.cellSize}px);
  gap: ${GRID_GAP}px;
  position: relative;
  width: ${props => props.columns * props.cellSize}px;
  height: ${props => props.rows * props.cellSize}px;
`;

const GridCell = styled.div`
  background: rgba(52, 73, 94, 0.6);
  border: 1px solid #4a6572;
  border-radius: 2px;
  &:hover { background: rgba(74, 101, 114, 0.8); }
`;

const Item = styled.div`
  position: absolute;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid #5d6d7e;
  border-radius: 4px;
  cursor: grab;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  z-index: 2;
  transition: all 0.2s ease;
  overflow: hidden;
  box-sizing: border-box;
  &:hover { transform: scale(1.02); border-color: #85929e; box-shadow: 0 4px 8px rgba(0,0,0,0.4); }
  &:active { cursor: grabbing; }
`;

const Placeholder = styled.div`
  position: absolute;
  background: rgba(255,255,255,0.3);
  border: 2px dashed #fff;
  border-radius: 4px;
  z-index: 1;
`;

const ItemImage = styled.img`
  width: 100%;
  height: 70%;
  object-fit: cover;
  display: block;
`;

const ItemName = styled.span`
  color: white;
  font-weight: 600;
  font-size: 10px;
  text-align: center;
  padding: 4px 2px;
  background: rgba(0,0,0,0.7);
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  box-sizing: border-box;
`;

const SmallItemImage = styled.img`
  width: 20px;
  height: 20px;
  object-fit: cover;
  border-radius: 3px;
  margin-right: 8px;
`;

const InventoryActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  &:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(39,174,96,0.3); }
`;

const ItemList = styled.div`
  background: #2c3e50;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #34495e;
  h3 { margin: 0 0 15px 0; color: #ecf0f1; font-size: 16px; }
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 8px 0;
  background: #34495e;
  border-radius: 6px;
  border-left: 4px solid #3498db;
  color: #ecf0f1;
  font-size: 14px;
  &:nth-child(odd) { background: #3d566e; }
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export { InventoryWithDnd as Inventory };
