import { useTranslation } from 'react-i18next';
import { Switch } from '@common/components';
import type { FocusTaskSettings } from '@modules/focus';

interface YouTubeSectionProps {
  settings: FocusTaskSettings;
  isLoading: boolean;
  onRemoveShortsChange: (value: boolean) => void;
}

const YouTubeSection = ({
  settings,
  isLoading,
  onRemoveShortsChange,
}: YouTubeSectionProps) => {
  const { t } = useTranslation();

  const label = t('focusTasks.removeShorts');

  return (
    <div className="tai:flex tai:flex-col tai:gap-3">
      <h3 className="tai:text-txt1">{t('focusTasks.youtubeSectionTitle')}</h3>
      <div className="tai:flex tai:flex-row tai:items-center tai:gap-3 tai:rounded-md tai:bg-secondary tai:p-3">
        <Switch
          id="focus-remove-shorts"
          checked={settings.removeShorts}
          disabled={isLoading}
          onCheckedChange={onRemoveShortsChange}
          label={label}
        />
        <label
          htmlFor="focus-remove-shorts"
          className="tai:cursor-pointer tai:text-txt2"
        >
          {label}
        </label>
      </div>
      <p className="tai:text-txt3">{t('focusTasks.removeShortsHint')}</p>
    </div>
  );
};

export default YouTubeSection;
