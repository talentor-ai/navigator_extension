import { DEFAULT_KEYWORD_LISTS } from '../constants/defaults';
import type { HighlightTone, KeywordList } from '../types';

const REGEX_SPECIAL_CHARACTERS = /[.*+?^${}()|[\]\\]/g;

export const escapeRegexValue = (value: string): string =>
  value.replace(REGEX_SPECIAL_CHARACTERS, '\\$&');

export const buildKeywordPatterns = (
  keywords: readonly string[],
): readonly RegExp[] =>
  Object.freeze(
    [...keywords]
      .sort((left, right) => right.length - left.length)
      .map(
        (keyword) =>
          new RegExp(
            `(?<![\\p{L}\\p{N}])${escapeRegexValue(keyword)}(?![\\p{L}\\p{N}])`,
            'giu',
          ),
      ),
  );

export interface PatternSet {
  tone: HighlightTone;
  patterns: readonly RegExp[];
}

export const HIGHLIGHT_TONES: readonly HighlightTone[] = Object.freeze([
  'positive',
  'negative',
  'orange',
  'purple',
]);

/**
 * Compiling ~160 regexes per scan would be wasteful, so pattern sets are built
 * once per list set. `buildPatternSets` lets callers highlight with custom
 * keyword lists; `PATTERN_SETS` keeps the shipped defaults for the whole-page
 * highlighter.
 */
export const buildPatternSets = (
  keywordLists: readonly KeywordList[],
): readonly PatternSet[] =>
  Object.freeze(
    keywordLists.map(({ tone, keywords }) => ({
      tone,
      patterns: buildKeywordPatterns(keywords),
    })),
  );

export const PATTERN_SETS: readonly PatternSet[] = buildPatternSets(
  DEFAULT_KEYWORD_LISTS,
);
