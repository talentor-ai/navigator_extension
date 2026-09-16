import { Icons } from '../Icons';

interface LauncherButtonProps {
  onClick: () => void;
}

export const LauncherButton = ({ onClick }: LauncherButtonProps) => (
  <button
    type="button"
    className="tai:fixed tai:right-6 tai:bottom-6 tai:z-[2147483647] tai:flex tai:h-14 tai:w-14 tai:cursor-pointer tai:items-center tai:justify-center tai:rounded-full tai:border-0 tai:bg-tertiary tai:text-primary tai:shadow-[0_8px_24px_rgba(0,0,0,0.28)] tai:transition-transform tai:hover:scale-105 tai:active:scale-95"
    aria-label="Open Talentor AI"
    onClick={onClick}
  >
    <Icons type="sparkles" size={26} />
  </button>
);
