import { useTranslation } from 'react-i18next';
import { Switch } from '@common/components';
import { H1, Input } from '@modules/popup/components';
import { InputFieldType } from '@modules/popup/models/model.form';
import useHighlighterSettings from './hooks/useHighlighterSettings';
import useHighlighterSelector from './hooks/useHighlighterSelector';

const Highlighter = () => {
  const { t } = useTranslation();
  const { settings, isLoading, updateEnabled } = useHighlighterSettings();
  const {
    hasHostname,
    isLoading: isSelectorLoading,
    register,
  } = useHighlighterSelector();
  const toggleLabel = settings.enabled
    ? t('highlighter.disableLabel')
    : t('highlighter.enableLabel');

  return (
    <section className="tai:flex tai:flex-col tai:gap-4 tai:text-txt1">
      <header className="tai:flex tai:flex-col tai:gap-1">
        <H1 className="tai:text-txt2">{t('highlighter.title')}</H1>
        <p className="tai:text-txt3">{t('highlighter.description')}</p>
      </header>

      <div className="tai:flex tai:flex-row tai:items-center tai:gap-3 tai:rounded-md tai:bg-secondary tai:p-3">
        <Switch
          id="highlighter-enabled"
          checked={settings.enabled}
          disabled={isLoading}
          onCheckedChange={updateEnabled}
          label={toggleLabel}
        />
        <label
          htmlFor="highlighter-enabled"
          className="tai:cursor-pointer tai:text-txt2"
        >
          {toggleLabel}
        </label>
      </div>

      <div className="tai:flex tai:flex-col tai:gap-1">
        <h3 className="tai:text-txt1">{t('highlighter.selectorTitle')}</h3>
        {!hasHostname && (
          <p className="tai:text-txt3">{t('highlighter.selectorNoHost')}</p>
        )}
        <Input
          name="selector"
          type={InputFieldType.text}
          placeholder={t('highlighter.selectorPlaceholder')}
          disabled={!hasHostname || isSelectorLoading}
          register={register}
        />
      </div>
    </section>
  );
};

export default Highlighter;
