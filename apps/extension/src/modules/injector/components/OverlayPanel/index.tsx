import { ButtonIcon } from '@common/components';
import {
  APP_URL,
  EDGE_MARGIN,
  LAUNCHER_SIZE,
  PANEL_HEIGHT,
  PANEL_WIDTH,
} from '../../constants';
import { clamp } from '../../utils';
import { useViewport } from '../../hooks/useViewport';
import { Icons } from '../Icons';
import type { Side } from '../../hooks/useDraggableLauncher';

interface OverlayPanelProps {
  side: Side;
  anchorY: number;
  onClose: () => void;
}

export const OverlayPanel = ({ side, anchorY, onClose }: OverlayPanelProps) => {
  const { width, height } = useViewport();
  const panelWidth = Math.min(PANEL_WIDTH, width - EDGE_MARGIN * 2);
  const panelHeight = Math.min(PANEL_HEIGHT, height - EDGE_MARGIN * 2);
  const maxTop = Math.max(EDGE_MARGIN, height - panelHeight - EDGE_MARGIN);
  const top = clamp(anchorY + LAUNCHER_SIZE - panelHeight, EDGE_MARGIN, maxTop);
  const horizontal =
    side === 'left' ? { left: EDGE_MARGIN } : { right: EDGE_MARGIN };

  return (
    <section
      style={{ top, width: panelWidth, height: panelHeight, ...horizontal }}
      className="tai:fixed tai:z-214748364 tai:overflow-hidden tai:rounded-2xl tai:bg-primary tai:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
      aria-label="Talentor AI"
    >
      <ButtonIcon
        aria-label="Close Talentor AI"
        onClick={onClose}
        className="tai:absolute tai:top-6 tai:right-6 tai:z-[2] tai:h-7 tai:w-7 tai:cursor-pointer tai:border-0 tai:bg-error-color tai:text-txt1 tai:hover:bg-error-color/70 tai:color-primary"
      >
        <Icons type="close" size={16} />
      </ButtonIcon>
      <iframe
        className="tai:block tai:h-full tai:w-full tai:border-0 tai:bg-primary"
        src={APP_URL}
        title="Talentor AI"
      />
    </section>
  );
};
