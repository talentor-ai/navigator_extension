export type {
  HighlightTone,
  HighlightThemeMode,
  HighlighterSettings,
  HighlighterOptions,
  HighlighterController,
  KeywordList,
} from './types';

export type { HighlighterSelectors } from './selectors';

export {
  DEFAULT_ROOT_SELECTOR,
  DEFAULT_TEXT_SELECTOR,
  DEFAULT_THEME_MODE,
  DEFAULT_KEYWORD_LISTS,
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

export {
  HIGHLIGHTER_SELECTORS_KEY,
  getSelectorForHost,
  readHighlighterSelectors,
  setHighlighterSelector,
  subscribeHighlighterSelectors,
} from './selectors';

export { startHighlighter } from './start';

export { createHighlighter } from './engine/createHighlighter';

export { highlightKeywords } from './engine/highlightKeywords';
