import { useEffect, useState } from 'react';

export interface ViewportSize {
  width: number;
  height: number;
}

const getSize = (): ViewportSize => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

export const useViewport = (): ViewportSize => {
  const [size, setSize] = useState<ViewportSize>(getSize);

  useEffect(() => {
    const handleResize = () => setSize(getSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};
