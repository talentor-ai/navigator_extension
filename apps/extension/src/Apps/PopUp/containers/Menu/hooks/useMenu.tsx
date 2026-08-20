import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const initialState: any = {
  picked: null,
  width: 0,
  left: 0,
};

const useMenu = () => {
  const [{ picked, width, left }, setPicked] = useState(initialState);
  const { pathname } = useLocation();

  useEffect(() => {
    const menuContainer = document.getElementById('menuContainer');
    if (!menuContainer) return;

    Array.from(menuContainer.children).forEach((menuItem, index) => {
      if (menuItem.id === `menu-${pathname}`) {
        const left =
          menuItem.getBoundingClientRect().left -
          // @ts-expect-error - For some reason, getBoundingClientRect() is not recognized
          menuItem?.parentNode?.getBoundingClientRect()?.left;

        setPicked({
          // @ts-expect-error - For some reason, offsetWidth() is not recognized
          width: menuItem?.offsetWidth,
          picked: index,
          left,
        });
        return;
      }
    });
  }, [pathname]);

  useEffect(() => {
    if (picked === null) {
      let firstChild: any = document.getElementById('menuContainer');
      firstChild = firstChild.firstElementChild;
      setPicked({
        width: firstChild.offsetWidth,
        left,
        picked: 0,
      });
    }
  }, [left, pathname, picked]);

  return {
    picked,
    width,
    left,
    setPicked,
  };
};

export default useMenu;
