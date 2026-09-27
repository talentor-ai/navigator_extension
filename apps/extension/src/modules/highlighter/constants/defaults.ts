import type { HighlightThemeMode, KeywordList } from '../types';
import {
  NEGATIVE_KEYWORDS,
  ORANGE_KEYWORDS,
  POSITIVE_KEYWORDS,
  PURPLE_KEYWORDS,
} from './keywords';

/**
 * Whole-page defaults: the highlighter scans the full document body, not a
 * site-specific container. Tags are listed explicitly (instead of `*`) so the
 * scan stays bounded to elements that can hold visible copy.
 */
export const DEFAULT_ROOT_SELECTOR = 'body';

export const DEFAULT_KEYWORD_LISTS: readonly KeywordList[] = [
  { tone: 'positive', keywords: POSITIVE_KEYWORDS },
  { tone: 'negative', keywords: NEGATIVE_KEYWORDS },
  { tone: 'orange', keywords: ORANGE_KEYWORDS },
  { tone: 'purple', keywords: PURPLE_KEYWORDS },
];

export const DEFAULT_TEXT_SELECTOR = [
  'p',
  'span',
  'a',
  'li',
  'div',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'td',
  'th',
  'dt',
  'dd',
  'label',
  'button',
  'small',
  'strong',
  'em',
  'b',
  'i',
  'blockquote',
  'figcaption',
  'summary',
  'legend',
].join(', ');

export const DEFAULT_THEME_MODE: HighlightThemeMode = 'auto';
