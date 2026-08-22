import { ICON_COMPONENTS } from './constants';
import type { IconsProps } from './types';

export function Icons({ type, className, style, ...rest }: IconsProps) {
  const IconComponent = ICON_COMPONENTS[type];
  return <IconComponent className={className} style={style} {...rest} />;
}

export type { IconType, IconsProps } from './types';
export { ICON_COMPONENTS } from './constants';
