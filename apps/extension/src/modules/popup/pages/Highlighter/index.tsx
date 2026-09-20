import { useTranslation } from 'react-i18next';
import { Switch } from '@common/components';
import { H1, Input } from '@modules/popup/components';
import { InputFieldType } from '@modules/popup/models/model.form';
import {
  NEGATIVE_KEYWORDS,
  ORANGE_KEYWORDS,
  POSITIVE_KEYWORDS,
  PURPLE_KEYWORDS,
} from '@modules/highlighter';
import useHighlighterSettings from './hooks/useHighlighterSettings';
import useHighlighterSelector from './hooks/useHighlighterSelector';

const TONE_SUMMARY = [
  { key: 'highlighter.tonePositive', count: POSITIVE_KEYWORDS.length },
  { key: 'highlighter.toneNegative', count: NEGATIVE_KEYWORDS.length },
  { key: 'highlighter.toneOrange', count: ORANGE_KEYWORDS.length },
  { key: 'highlighter.tonePurple', count: PURPLE_KEYWORDS.length },
];

const Highlighter = () => {
  const { t } = useTranslation();
  const { settings, isLoading, updateEnabled } = useHighlighterSettings();
  const {
    hostname,
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
        <p className="tai:text-txt3">
          {hasHostname
            ? t('highlighter.selectorHint', { hostname })
            : t('highlighter.selectorNoHost')}
        </p>
        <Input
          name="selector"
          type={InputFieldType.text}
          placeholder={t('highlighter.selectorPlaceholder')}
          disabled={!hasHostname || isSelectorLoading}
          register={register}
        />
      </div>

      <div className="tai:flex tai:flex-col tai:gap-1">
        <h3 className="tai:text-txt1">{t('highlighter.skillsTitle')}</h3>
        <ul className="tai:flex tai:flex-col tai:text-txt3">
          {TONE_SUMMARY.map(({ key, count }) => (
            <li key={key}>
              {t(key)}: {count}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Highlighter;
