import {
  LuCheck,
  LuChevronDown,
  LuChevronUp,
  LuGripVertical,
  LuHouse,
  LuLogOut,
  LuPlus,
  LuTrash2,
  LuUser,
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
} as const;
