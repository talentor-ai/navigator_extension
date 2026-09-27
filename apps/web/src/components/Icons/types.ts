import type { ICON_COMPONENTS } from './constants';

export type IconType = keyof typeof ICON_COMPONENTS;

export type IconsProps = {
  type: IconType;
  className?: string;
  style?: React.CSSProperties;
} & Omit<React.SVGProps<SVGSVGElement>, 'type'> & {
    size?: string | number;
    color?: string;
    title?: string;
  };
