import { useOverlay } from './hooks/useOverlay';
import { LauncherButton } from './components/LauncherButton';
import { OverlayPanel } from './components/OverlayPanel';

export const App = () => {
  const { isOpen, open, close } = useOverlay();

  return (
    <>
      {isOpen && <OverlayPanel onClose={close} />}
      {!isOpen && <LauncherButton onClick={open} />}
    </>
  );
};
