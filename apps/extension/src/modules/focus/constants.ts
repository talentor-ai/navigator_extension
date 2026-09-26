import type { FocusTaskSettings } from './types';

export const FOCUS_TASKS_KEY = 'focus-tasks';

export const DEFAULT_FOCUS_TASK_SETTINGS: FocusTaskSettings = {
  removeShorts: false,
};

export const YOUTUBE_HOSTS: string[] = ['www.youtube.com'];

export const YOUTUBE_HOME_URL = 'https://www.youtube.com/';

/**
 * Curated Shorts-only selectors. `:has()` is supported in Chrome, so we can
 * target regular shelves/items that link to `/shorts` without hiding normal
 * YouTube content.
 */
export const YOUTUBE_SHORTS_SELECTORS: string[] = [
  'ytd-reel-shelf-renderer',
  'ytd-rich-section-renderer:has(ytd-reel-shelf-renderer)',
  'ytd-rich-shelf-renderer[is-shorts]',
  '[is-shorts]',
  'ytd-video-renderer:has(a[href^="/shorts"])',
  'ytd-rich-item-renderer:has(a[href^="/shorts"])',
  'ytd-compact-video-renderer:has(a[href^="/shorts"])',
  'ytd-grid-video-renderer:has(a[href^="/shorts"])',
  'ytd-guide-entry-renderer:has(a[title="Shorts"])',
  'ytd-mini-guide-entry-renderer:has(a[href^="/shorts"])',
  'ytd-browse[page-subtype="shorts"]',
];
