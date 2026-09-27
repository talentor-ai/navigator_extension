import type {
  HighlighterController,
  HighlighterOptions,
  KeywordList,
} from '../types';
import { createHighlighter } from './createHighlighter';

/**
 * Reusable entry point: highlights every keyword from `keywordLists` inside the
 * container matched by `cssSelector`. Invalid or missing selectors fall back to
 * the engine defaults (`body`), so callers can pass user-provided values.
 */
export const highlightKeywords = (
  keywordLists: readonly KeywordList[],
  cssSelector: string,
  options: Omit<HighlighterOptions, 'keywordLists' | 'rootSelector'> = {},
): HighlighterController =>
  createHighlighter({
    ...options,
    rootSelector: cssSelector,
    keywordLists,
  });
