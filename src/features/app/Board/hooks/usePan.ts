// hooks/usePan.ts
import { useState, useRef, useCallback, useEffect } from 'react';

interface UsePanReturn {
  position: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
  resetPosition: () => void;
  handleMouseDown: (event: React.MouseEvent) => void;
}

export const usePan = (zoom: number): UsePanReturn => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button !== 0) return;
    
    event.preventDefault();
    setIsDragging(true);
    lastMousePos.current = { x: event.clientX, y: event.clientY };
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = (event.clientX - lastMousePos.current.x) / zoom;
    const deltaY = (event.clientY - lastMousePos.current.y) / zoom;

    setPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

    lastMousePos.current = { x: event.clientX, y: event.clientY };
  }, [isDragging, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetPosition = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleZoom = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { offsetX, offsetY } = customEvent.detail;
      
      setPosition(prev => ({
        x: prev.x + offsetX / zoom,
        y: prev.y + offsetY / zoom
      }));
    };

    container.addEventListener('canvas-zoom', handleZoom as EventListener);

    return () => {
      container.removeEventListener('canvas-zoom', handleZoom as EventListener);
    };
  }, [zoom]);

  return {
    position,
    containerRef,
    isDragging,
    resetPosition,
    handleMouseDown,
  };
};