import { useEffect, useState } from 'react';
import { getViewportSize } from '../utils';

export interface ViewportSize {
  width: number;
  height: number;
}

export const useViewport = (): ViewportSize => {
  const [size, setSize] = useState<ViewportSize>(getViewportSize);

  useEffect(() => {
    const handleResize = () => setSize(getViewportSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};
