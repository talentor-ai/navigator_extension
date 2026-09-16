import { useOverlay } from './hooks/useOverlay';
import { useDraggableLauncher } from './hooks/useDraggableLauncher';
import { LauncherButton } from './components/LauncherButton';
import { OverlayPanel } from './components/OverlayPanel';

export const App = () => {
  const { isOpen, open, close } = useOverlay();
  const drag = useDraggableLauncher();

  if (!drag.isReady) return null;

  return isOpen ? (
    <OverlayPanel side={drag.side} anchorY={drag.position.y} onClose={close} />
  ) : (
    <LauncherButton drag={drag} onClick={open} />
  );
};
