import { ButtonIcon } from '@common/components';
import { Icons } from '../Icons';

interface LauncherButtonProps {
  onClick: () => void;
}

export const LauncherButton = ({ onClick }: LauncherButtonProps) => (
  <ButtonIcon
    aria-label="Open Talentor AI"
    onClick={onClick}
    className="tai:fixed tai:right-6 tai:bottom-6 tai:z-2147483647 tai:h-10 tai:w-10 tai:border-0 tai:bg-tertiary tai:text-primary tai:shadow-[0_8px_24px_rgba(0,0,0,0.28)] tai:transition-transform tai:hover:scale-105 tai:active:scale-95"
  >
    <Icons type="sparkles" size={26} />
  </ButtonIcon>
);
