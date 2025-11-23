// hooks/useZoom.ts
import { useState, useRef, useCallback, useEffect } from 'react';

interface UseZoomReturn {
  zoom: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  resetZoom: () => void;
  setZoom: (value: number) => void;
}

export const useZoom = (): UseZoomReturn => {
  const [zoom, setZoom] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const containerCenterX = rect.width / 2;
    const containerCenterY = rect.height / 2;
    
    const mouseRelX = (mouseX - containerCenterX) / rect.width;
    const mouseRelY = (mouseY - containerCenterY) / rect.height;

    const delta = -event.deltaY;
    const zoomSensitivity = 0.001;
    const zoomFactor = 1 + delta * zoomSensitivity;
    const newZoom = zoom * zoomFactor;
    
    const minZoom = 0.1;
    const maxZoom = 5;
    const clampedZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);

    const zoomRatio = clampedZoom / zoom;
    const offsetX = (mouseRelX * rect.width) * (1 - zoomRatio);
    const offsetY = (mouseRelY * rect.height) * (1 - zoomRatio);

    setZoom(clampedZoom);

    const zoomEvent = new CustomEvent('canvas-zoom', {
      detail: { offsetX, offsetY, zoom: clampedZoom }
    });
    container.dispatchEvent(zoomEvent);

  }, [zoom]);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  return {
    zoom,
    containerRef,
    resetZoom,
    setZoom,
  };
};