import { ICON_COMPONENTS } from './constants';
import type { IconsProps } from './types';

export const Icons = ({
  type,
  className,
  style,
  strokeWidth = 2.7,
  ...rest
}: IconsProps) => {
  const IconComponent = ICON_COMPONENTS[type];

  return (
    <IconComponent
      className={className}
      style={style}
      strokeWidth={strokeWidth}
      {...rest}
    />
  );
};

export type { IconType, IconsProps } from './types';
export { ICON_COMPONENTS } from './constants';
