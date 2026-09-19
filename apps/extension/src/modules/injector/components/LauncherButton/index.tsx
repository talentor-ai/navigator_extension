import { ButtonIcon } from '@common/components';
import { Icons } from '../Icons';
import type { LauncherDrag } from '../../hooks/useDraggableLauncher';

interface LauncherButtonProps {
  drag: LauncherDrag;
  onClick: () => void;
}

export const LauncherButton = ({ drag, onClick }: LauncherButtonProps) => {
  const {
    position,
    isDragging,
    didDragRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = drag;

  const handleClick = () => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    onClick();
  };

  return (
    <ButtonIcon
      aria-label="Open Talentor AI"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ left: position.x, top: position.y }}
      className={`tai:fixed tai:z-[2147483647] tai:h-10 tai:w-10 tai:touch-none tai:select-none tai:border-0 tai:bg-tertiary tai:text-primary tai:shadow-[0_8px_24px_rgba(0,0,0,0.28)] ${
        isDragging
          ? 'tai:cursor-grabbing'
          : 'tai:cursor-grab tai:transition-[left,top,transform] tai:duration-500 tai:ease-[cubic-bezier(0.85,0,0.19,1.5)] tai:hover:scale-105 tai:active:scale-95'
      }`}
    >
      <Icons type="sparkles" size={20} />
    </ButtonIcon>
  );
};
