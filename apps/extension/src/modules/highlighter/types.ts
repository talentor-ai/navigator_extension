export type HighlightTone = 'positive' | 'negative' | 'orange' | 'purple';

export type HighlightThemeMode = 'auto' | 'light' | 'dark';

export interface HighlighterSettings {
  enabled: boolean;
}

export interface HighlighterOptions {
  rootSelector?: string;
  textSelector?: string;
  themeMode?: HighlightThemeMode;
}

export interface HighlighterController {
  stop: () => void;
}
