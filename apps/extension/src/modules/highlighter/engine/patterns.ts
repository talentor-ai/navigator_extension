import {
  NEGATIVE_KEYWORDS,
  ORANGE_KEYWORDS,
  POSITIVE_KEYWORDS,
  PURPLE_KEYWORDS,
} from '../constants/keywords';
import type { HighlightTone } from '../types';

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

/** Built once per page: compiling ~160 regexes per scan would be wasteful. */
export const PATTERN_SETS: readonly PatternSet[] = Object.freeze([
  { tone: 'positive', patterns: buildKeywordPatterns(POSITIVE_KEYWORDS) },
  { tone: 'negative', patterns: buildKeywordPatterns(NEGATIVE_KEYWORDS) },
  { tone: 'orange', patterns: buildKeywordPatterns(ORANGE_KEYWORDS) },
  { tone: 'purple', patterns: buildKeywordPatterns(PURPLE_KEYWORDS) },
]);
