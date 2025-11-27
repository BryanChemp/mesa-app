import { useEffect, useRef, useState } from "react";
import DiceBox from "@3d-dice/dice-box";

type Props = {
  expression: string;
  onResult?: (n: number) => void;
  rollKey?: number;
  autoRoll?: boolean;
};

let diceInstance: DiceBox | null = null;
let initializationPromise: Promise<void> | null = null;

const initializeDiceBox = async (container: HTMLElement): Promise<DiceBox> => {
  if (diceInstance) {
    if (container && diceInstance.canvas.parentElement !== container) {
      container.appendChild(diceInstance.canvas);
    }
    return diceInstance;
  }

  if (initializationPromise) {
    await initializationPromise;
    return diceInstance!;
  }

  initializationPromise = (async () => {
    diceInstance = new DiceBox("#dice-container", {
      assetPath: "/assets/",
      throwForce: 6,
      scale: 8,
      theme: "default",
      gravity: 1,
      mass: 2,
      friction: 0.4,
      restitution: 0.3,
      linearDamping: 0.4,
      angularDamping: 0.4,
      spinForce: 2,
      startingHeight: 8,
      lightIntensity: 1.2,
    });
    
    await diceInstance.init();
  })();

  await initializationPromise;
  return diceInstance!;
};

export default function Dice3D({ expression, onResult, rollKey, autoRoll = false }: Props) {
  const [rollResult, setRollResult] = useState<number | undefined>();
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Inicialização do DiceBox
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        if (containerRef.current) {
          await initializeDiceBox(containerRef.current);
          if (mounted) {
            setIsInitialized(true);
          }
        }
      } catch (error) {
        console.error("Failed to initialize DiceBox:", error);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  // Configura o callback quando os dados terminam de rolar
  useEffect(() => {
    if (!diceInstance) return;

    const handleRollComplete = (results: any[]) => {
      console.log('Roll results:', results);
      const total = results.reduce((sum, result) => sum + result.value, 0);
      setRollResult(total);
      if (onResult) {
        onResult(total);
      }
    };

    diceInstance.onRollComplete = handleRollComplete;

    return () => {
      if (diceInstance) {
        diceInstance.onRollComplete = undefined;
      }
    };
  }, [onResult]);

  useEffect(() => {
    if (autoRoll && isInitialized && expression && diceInstance) {
      console.log('Rolling automatically:', expression);
      
      setRollResult(undefined);
      
      setTimeout(() => {
        if (diceInstance) {
          try {
            diceInstance.roll(expression);
          } catch (error) {
            console.error("Error rolling dice:", error);
          }
        }
      }, 500);
    }
  }, [expression, autoRoll, rollKey, isInitialized]);

  return (
    <div 
      id="dice-container"
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        display: "flex", 
        flex: 1,
        position: 'relative',
        backgroundColor: '#3b2323',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
    </div>
  );
}