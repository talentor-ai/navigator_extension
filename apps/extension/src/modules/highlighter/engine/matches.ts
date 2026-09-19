import type { HighlightTone } from '../types';

export interface TextMatch {
  start: number;
  end: number;
  tone: HighlightTone;
}

export const collectMatches = (
  text: string,
  patterns: readonly RegExp[],
  tone: HighlightTone,
): TextMatch[] => {
  const matches: TextMatch[] = [];

  for (const pattern of patterns) {
    pattern.lastIndex = 0;

    let match = pattern.exec(text);

    while (match) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        tone,
      });

      match = pattern.exec(text);
    }
  }

  return matches;
};

export const selectMatches = (matches: TextMatch[]): TextMatch[] => {
  matches.sort((left, right) => {
    if (left.start !== right.start) {
      return left.start - right.start;
    }

    const leftLength = left.end - left.start;
    const rightLength = right.end - right.start;

    if (leftLength !== rightLength) {
      return rightLength - leftLength;
    }

    return left.tone.localeCompare(right.tone);
  });

  const selectedMatches: TextMatch[] = [];
  let lastEnd = -1;

  for (const match of matches) {
    if (match.start < lastEnd) {
      continue;
    }

    selectedMatches.push(match);
    lastEnd = match.end;
  }

  return selectedMatches;
};
