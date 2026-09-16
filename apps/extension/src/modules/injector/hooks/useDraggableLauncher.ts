import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { EDGE_MARGIN, LAUNCHER_SIZE } from '../constants';
import { clamp, getViewportSize } from '../utils';

const DRAG_THRESHOLD = 4;
const STORAGE_KEY = 'launcher-position';

export type Side = 'left' | 'right';

export interface Position {
  x: number;
  y: number;
}

interface StoredPosition {
  side: Side;
  y: number;
}

const getBounds = () => {
  const { width, height } = getViewportSize();
  return {
    maxX: Math.max(EDGE_MARGIN, width - LAUNCHER_SIZE - EDGE_MARGIN),
    maxY: Math.max(EDGE_MARGIN, height - LAUNCHER_SIZE - EDGE_MARGIN),
  };
};

const xForSide = (side: Side) => {
  if (side === 'left') return EDGE_MARGIN;
  const { width } = getViewportSize();
  return Math.max(EDGE_MARGIN, width - LAUNCHER_SIZE - EDGE_MARGIN);
};

const defaultPosition = (): Position => ({
  x: xForSide('right'),
  y: getBounds().maxY,
});

export const useDraggableLauncher = () => {
  const [position, setPosition] = useState<Position>(defaultPosition);
  const [side, setSide] = useState<Side>('right');
  const [isDragging, setIsDragging] = useState(false);
  const positionRef = useRef(position);
  const sideRef = useRef<Side>('right');
  const didDragRef = useRef(false);
  const dragState = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);

  const updatePosition = useCallback((next: Position) => {
    positionRef.current = next;
    setPosition(next);
  }, []);

  useEffect(() => {
    let active = true;
    const restore = async () => {
      try {
        const result = await chrome.storage?.local?.get(STORAGE_KEY);
        const stored = result?.[STORAGE_KEY] as StoredPosition | undefined;
        if (!active || !stored) return;
        const restoredSide: Side = stored.side === 'left' ? 'left' : 'right';
        sideRef.current = restoredSide;
        setSide(restoredSide);
        updatePosition({
          x: xForSide(restoredSide),
          y: clamp(stored.y, EDGE_MARGIN, getBounds().maxY),
        });
      } catch {
        /* storage unavailable; keep defaults */
      }
    };
    void restore();
    return () => {
      active = false;
    };
  }, [updatePosition]);

  useEffect(() => {
    const handleResize = () =>
      updatePosition({
        x: xForSide(sideRef.current),
        y: clamp(positionRef.current.y, EDGE_MARGIN, getBounds().maxY),
      });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updatePosition]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      didDragRef.current = false;
      dragState.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: positionRef.current.x,
        originY: positionRef.current.y,
        moved: false,
      };
      setIsDragging(true);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      const drag = dragState.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      drag.moved = true;
      didDragRef.current = true;
      const { maxX, maxY } = getBounds();
      updatePosition({
        x: clamp(drag.originX + dx, EDGE_MARGIN, maxX),
        y: clamp(drag.originY + dy, EDGE_MARGIN, maxY),
      });
    },
    [updatePosition],
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      const drag = dragState.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      dragState.current = null;
      setIsDragging(false);
      if (!drag.moved) return;
      const { y } = positionRef.current;
      const { width } = getViewportSize();
      const snappedSide: Side =
        positionRef.current.x + LAUNCHER_SIZE / 2 < width / 2
          ? 'left'
          : 'right';
      sideRef.current = snappedSide;
      setSide(snappedSide);
      updatePosition({ x: xForSide(snappedSide), y });
      void chrome.storage?.local?.set({
        [STORAGE_KEY]: { side: snappedSide, y },
      });
    },
    [updatePosition],
  );

  return {
    position,
    side,
    isDragging,
    didDragRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
};

export type LauncherDrag = ReturnType<typeof useDraggableLauncher>;
