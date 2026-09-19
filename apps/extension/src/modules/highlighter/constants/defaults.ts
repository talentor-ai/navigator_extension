import type { HighlightThemeMode } from '../types';

/**
 * Whole-page defaults: the highlighter scans the full document body, not a
 * site-specific container. Tags are listed explicitly (instead of `*`) so the
 * scan stays bounded to elements that can hold visible copy.
 */
export const DEFAULT_ROOT_SELECTOR = 'body';

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
