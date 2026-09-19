export type {
  HighlightTone,
  HighlightThemeMode,
  HighlighterSettings,
  HighlighterOptions,
  HighlighterController,
} from './types';

export {
  DEFAULT_ROOT_SELECTOR,
  DEFAULT_TEXT_SELECTOR,
  DEFAULT_THEME_MODE,
} from './constants/defaults';

export {
  POSITIVE_KEYWORDS,
  NEGATIVE_KEYWORDS,
  ORANGE_KEYWORDS,
  PURPLE_KEYWORDS,
} from './constants/keywords';

export {
  HIGHLIGHTER_SETTINGS_KEY,
  DEFAULT_HIGHLIGHTER_SETTINGS,
  readHighlighterSettings,
  writeHighlighterSettings,
  subscribeHighlighterSettings,
} from './storage';

export { startHighlighter } from './start';

export { createHighlighter } from './engine/createHighlighter';
