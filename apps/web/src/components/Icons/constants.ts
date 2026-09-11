import {
  LuCheck,
  LuChevronDown,
  LuChevronUp,
  LuGripVertical,
  LuHouse,
  LuLogOut,
  LuMenu,
  LuPlus,
  LuTrash2,
  LuUser,
  LuX,
} from 'react-icons/lu';

export const ICON_COMPONENTS = {
  home: LuHouse,
  profile: LuUser,
  logout: LuLogOut,
  check: LuCheck,
  chevronDown: LuChevronDown,
  chevronUp: LuChevronUp,
  add: LuPlus,
  delete: LuTrash2,
  drag: LuGripVertical,
  menu: LuMenu,
  close: LuX,
} as const;
