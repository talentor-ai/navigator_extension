import { ICON_COMPONENTS } from './constants';
import type { IconsProps } from './types';

export function Icons({
  type,
  className,
  style,
  strokeWidth = 2.8,
  ...rest
}: IconsProps) {
  const IconComponent = ICON_COMPONENTS[type];
  return (
    <IconComponent
      className={className}
      style={style}
      strokeWidth={strokeWidth}
      {...rest}
    />
  );
}

export type { IconType, IconsProps } from './types';
export { ICON_COMPONENTS } from './constants';
