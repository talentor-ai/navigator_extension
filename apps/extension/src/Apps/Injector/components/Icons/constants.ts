import {
  LuCheck,
  LuChevronDown,
  LuChevronUp,
  LuExternalLink,
  LuLogOut,
  LuMenu,
  LuPenLine,
  LuPlus,
  LuSparkles,
  LuTrash2,
  LuUser,
  LuX,
} from 'react-icons/lu';

export const ICON_COMPONENTS = {
  sparkles: LuSparkles,
  close: LuX,
  plus: LuPlus,
  delete: LuTrash2,
  edit: LuPenLine,
  user: LuUser,
  logout: LuLogOut,
  check: LuCheck,
  chevronDown: LuChevronDown,
  chevronUp: LuChevronUp,
  menu: LuMenu,
  externalLink: LuExternalLink,
} as const;
