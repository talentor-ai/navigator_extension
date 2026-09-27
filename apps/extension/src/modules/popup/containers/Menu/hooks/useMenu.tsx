import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export interface MenuSelection {
  picked: number | null;
  width: number;
  left: number;
}

const EMPTY_SELECTION: MenuSelection = { picked: null, width: 0, left: 0 };

const MENU_ITEM_SELECTOR = '[id^="menu-"]';

const findActiveIndex = (
  paths: readonly string[],
  pathname: string,
): number => {
  let bestIndex = -1;
  let bestLength = -1;

  paths.forEach((path, index) => {
    const isActive = pathname === path || pathname.startsWith(`${path}/`);
    if (!isActive || path.length <= bestLength) return;
    bestIndex = index;
    bestLength = path.length;
  });

  return bestIndex;
};

const useMenu = (paths: readonly string[]): MenuSelection => {
  const { pathname } = useLocation();
  const [selection, setSelection] = useState<MenuSelection>(EMPTY_SELECTION);
  const pathKey = paths.join('|');

  const measure = useCallback(() => {
    const container = document.getElementById('menuContainer');
    if (!container) return;

    const routePaths = pathKey === '' ? [] : pathKey.split('|');
    const activeIndex = findActiveIndex(routePaths, pathname);

    if (activeIndex === -1) {
      setSelection(EMPTY_SELECTION);
      return;
    }

    const activeId = `menu-${routePaths[activeIndex]}`;
    const items = Array.from(
      container.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR),
    );
    const activeItem = items.find((item) => item.id === activeId);

    if (!activeItem) {
      setSelection(EMPTY_SELECTION);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    setSelection({
      picked: items.indexOf(activeItem),
      width: activeItem.offsetWidth,
      left: itemRect.left - containerRect.left,
    });
  }, [pathKey, pathname]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  return selection;
};

export default useMenu;
