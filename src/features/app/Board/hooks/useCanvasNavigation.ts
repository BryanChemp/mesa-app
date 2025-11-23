// hooks/useCanvasNavigation.ts
import { useCallback } from 'react';
import { useZoom } from './useZoom';
import { usePan } from './usePan';

interface UseCanvasNavigationReturn {
  zoom: number;
  position: { x: number; y: number };
  isDragging: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleMouseDown: (event: React.MouseEvent) => void;
  resetView: () => void;
  setZoom: (value: number) => void;
}

export const useCanvasNavigation = (): UseCanvasNavigationReturn => {
  const { 
    zoom, 
    containerRef: zoomContainerRef, 
    resetZoom, 
    setZoom 
  } = useZoom();
  
  const {
    position,
    containerRef: panContainerRef,
    isDragging,
    resetPosition,
    handleMouseDown: panHandleMouseDown,
  } = usePan(zoom);

  const containerRef = zoomContainerRef || panContainerRef;

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    panHandleMouseDown(event);
  }, [panHandleMouseDown]);

  const resetView = useCallback(() => {
    resetZoom();
    resetPosition();
  }, [resetZoom, resetPosition]);

  return {
    zoom,
    position,
    isDragging,
    containerRef,
    handleMouseDown,
    resetView,
    setZoom,
  };
};