import type { HighlightTone } from '../types';
import { collectTextNodes } from './dom';
import { collectMatches, selectMatches } from './matches';
import { HIGHLIGHT_TONES, PATTERN_SETS } from './patterns';

type RangesByTone = Record<HighlightTone, Range[]>;

interface CachedEntry {
  text: string;
  ranges: RangesByTone;
}

export interface PageScanner {
  scan: (root: Element) => RangesByTone;
}

const createEmptyRanges = (): RangesByTone => ({
  positive: [],
  negative: [],
  orange: [],
  purple: [],
});

/**
 * Whole-page scanning is rescanned on every DOM mutation, so ranges are cached
 * per text node and rebuilt only when that node's text actually changed. Ranges
 * are position-only objects: reusing them across scans is safe.
 */
export const createScanner = (textSelector: string): PageScanner => {
  const cache = new Map<Text, CachedEntry>();
  const collectTargets = (root: Element): Element[] =>
    textSelector.trim() === ''
      ? [root]
      : Array.from(root.querySelectorAll(textSelector));

  const buildRanges = (textNode: Text): RangesByTone => {
    const rangesByTone = createEmptyRanges();
    const text = textNode.textContent ?? '';
    const matches = selectMatches(
      PATTERN_SETS.flatMap(({ tone, patterns }) =>
        collectMatches(text, patterns, tone),
      ),
    );

    for (const match of matches) {
      const range = new Range();
      range.setStart(textNode, match.start);
      range.setEnd(textNode, match.end);
      rangesByTone[match.tone].push(range);
    }

    return rangesByTone;
  };

  const getEntry = (textNode: Text): CachedEntry => {
    const text = textNode.textContent ?? '';
    const cached = cache.get(textNode);

    if (cached && cached.text === text) {
      return cached;
    }

    const entry: CachedEntry = { text, ranges: buildRanges(textNode) };
    cache.set(textNode, entry);
    return entry;
  };

  const pruneDetached = (): void => {
    for (const textNode of cache.keys()) {
      if (!textNode.isConnected) {
        cache.delete(textNode);
      }
    }
  };

  const scan = (root: Element): RangesByTone => {
    const rangesByTone = createEmptyRanges();
    const seen = new Set<Text>();

    for (const target of collectTargets(root)) {
      for (const textNode of collectTextNodes(target)) {
        if (seen.has(textNode)) continue;
        seen.add(textNode);

        const entry = getEntry(textNode);

        for (const tone of HIGHLIGHT_TONES) {
          rangesByTone[tone].push(...entry.ranges[tone]);
        }
      }
    }

    pruneDetached();

    return rangesByTone;
  };

  return { scan };
};
