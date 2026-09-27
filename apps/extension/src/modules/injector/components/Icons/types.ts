import type { CSSProperties, SVGProps } from 'react';
import type { ICON_COMPONENTS } from './constants';

export type IconType = keyof typeof ICON_COMPONENTS;

export type IconsProps = {
  type: IconType;
  className?: string;
  style?: CSSProperties;
  size?: string | number;
  color?: string;
  title?: string;
} & Omit<SVGProps<SVGSVGElement>, 'type'>;
