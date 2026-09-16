import { APP_URL } from '../../constants';
import { Icons } from '../Icons';

interface OverlayPanelProps {
  onClose: () => void;
}

export const OverlayPanel = ({ onClose }: OverlayPanelProps) => (
  <section
    className="tai:fixed tai:right-6 tai:bottom-6 tai:z-[2147483647] tai:h-[600px] tai:max-h-[calc(100vh-3rem)] tai:w-[400px] tai:max-w-[calc(100vw-3rem)] tai:overflow-hidden tai:rounded-2xl tai:bg-primary tai:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
    aria-label="Talentor AI"
  >
    <button
      type="button"
      className="tai:absolute tai:top-2 tai:right-2 tai:z-[2] tai:flex tai:h-7 tai:w-7 tai:cursor-pointer tai:items-center tai:justify-center tai:rounded-full tai:border-0 tai:bg-black/35 tai:text-txt1 tai:hover:bg-black/55"
      aria-label="Close Talentor AI"
      onClick={onClose}
    >
      <Icons type="close" size={16} />
    </button>
    <iframe
      className="tai:block tai:h-full tai:w-full tai:border-0 tai:bg-primary"
      src={APP_URL}
      title="Talentor AI"
    />
  </section>
);
