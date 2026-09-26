import { useTranslation } from 'react-i18next';
import { H1 } from '@modules/popup/components';
import YouTubeSection from './components/YouTubeSection';
import useFocusTasksSettings from './hooks/useFocusTasksSettings';

const FocusTasks = () => {
  const { t } = useTranslation();
  const { hostname, isYouTube, settings, isLoading, updateRemoveShorts } =
    useFocusTasksSettings();

  return (
    <section className="tai:flex tai:flex-col tai:gap-4 tai:text-txt1">
      <header className="tai:flex tai:flex-col tai:gap-1">
        <H1 className="tai:text-txt2">{t('focusTasks.title')}</H1>
        <p className="tai:text-txt3">{t('focusTasks.description')}</p>
        {hostname && (
          <p className="tai:text-txt3">
            {t('focusTasks.currentSite')}: {hostname}
          </p>
        )}
      </header>

      {isYouTube ? (
        <YouTubeSection
          settings={settings}
          isLoading={isLoading}
          onRemoveShortsChange={updateRemoveShorts}
        />
      ) : (
        <p className="tai:text-txt3">{t('focusTasks.noTasks')}</p>
      )}
    </section>
  );
};

export default FocusTasks;
