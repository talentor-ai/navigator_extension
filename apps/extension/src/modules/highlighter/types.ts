export type HighlightTone = 'positive' | 'negative' | 'orange' | 'purple';

export type HighlightThemeMode = 'auto' | 'light' | 'dark';

export type HighlighterSettings = Record<string, boolean>;

export interface KeywordList {
  tone: HighlightTone;
  keywords: readonly string[];
}

export interface HighlighterOptions {
  rootSelector?: string;
  textSelector?: string;
  themeMode?: HighlightThemeMode;
  keywordLists?: readonly KeywordList[];
}

export interface HighlighterController {
  stop: () => void;
}
