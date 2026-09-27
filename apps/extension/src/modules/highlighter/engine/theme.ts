import type { HighlightThemeMode, HighlightTone } from '../types';

export const HIGHLIGHT_NAMES: Readonly<Record<HighlightTone, string>> = {
  positive: 'talentor-keywords-positive',
  negative: 'talentor-keywords-negative',
  orange: 'talentor-keywords-orange',
  purple: 'talentor-keywords-purple',
};

const DARK_THEME_ATTRIBUTES = [
  'data-color-mode',
  'data-color-theme',
  'data-theme',
] as const;

const DARK_THEME_CLASSES = ['theme--dark', 'artdeco-theme-dark'] as const;

const OBSERVED_THEME_ATTRIBUTES = ['class', ...DARK_THEME_ATTRIBUTES];

const DARK_THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

export const isDarkThemeActive = (themeMode: HighlightThemeMode): boolean => {
  if (themeMode === 'light') {
    return false;
  }

  if (themeMode === 'dark') {
    return true;
  }

  const themeElements = [document.documentElement, document.body].filter(
    (element): element is HTMLElement => element instanceof HTMLElement,
  );

  for (const element of themeElements) {
    const hasDarkAttribute = DARK_THEME_ATTRIBUTES.some(
      (attribute) => element.getAttribute(attribute) === 'dark',
    );

    if (hasDarkAttribute) {
      return true;
    }

    const hasDarkClass = DARK_THEME_CLASSES.some((className) =>
      element.classList.contains(className),
    );

    if (hasDarkClass) {
      return true;
    }
  }

  return globalThis.matchMedia?.(DARK_THEME_MEDIA_QUERY).matches ?? false;
};

const TEXT_DARK = '#111111';
const TEXT_LIGHT = '#ffffff';
const LIGHT_BASE = '#ffffff';
const DARK_BASE = '#121212';

type Rgba = [number, number, number, number];

const parseRgba = (value: string): Rgba | null => {
  const match = value.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i,
  );
  if (!match) return null;

  return [
    Number(match[1]),
    Number(match[2]),
    Number(match[3]),
    match[4] === undefined ? 1 : Number(match[4]),
  ];
};

const parseHex = (value: string): Rgba => {
  const hex = value.replace('#', '');
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((char) => char + char)
          .join('')
      : hex;

  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
    1,
  ];
};

const composite = (foreground: Rgba, background: Rgba): Rgba => {
  const alpha = foreground[3] + background[3] * (1 - foreground[3]);
  if (alpha === 0) return [0, 0, 0, 0];

  return [
    (foreground[0] * foreground[3] +
      background[0] * background[3] * (1 - foreground[3])) /
      alpha,
    (foreground[1] * foreground[3] +
      background[1] * background[3] * (1 - foreground[3])) /
      alpha,
    (foreground[2] * foreground[3] +
      background[2] * background[3] * (1 - foreground[3])) /
      alpha,
    alpha,
  ];
};

const relativeLuminance = ([r, g, b]: Rgba): number => {
  const channel = (value: number): number => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

/**
 * Picks the higher-contrast text color (near-black or white) for a highlight
 * background composited over the page base. Pure color change; no other
 * `::highlight()` properties are affected.
 */
const pickTextColor = (background: string, base: string): string => {
  const parsed = parseRgba(background);
  if (!parsed) return TEXT_LIGHT;

  const composited = composite(parsed, parseHex(base));
  return relativeLuminance(composited) > 0.179 ? TEXT_DARK : TEXT_LIGHT;
};

export const buildHighlightStyle = (isDark: boolean): string => {
  const colors = isDark
    ? {
        positiveBackground: 'rgba(74, 222, 128, 1)',
        negativeBackground: 'rgba(248, 113, 113, 1)',
        orangeBackground: 'rgba(251, 191, 36, 1)',
        purpleBackground: 'rgba(192, 132, 252, 1)',
      }
    : {
        positiveBackground: 'rgba(46, 125, 50, 1)',
        negativeBackground: 'rgba(198, 40, 40, 1)',
        orangeBackground: 'rgba(245, 124, 0, 1)',
        purpleBackground: 'rgba(123, 31, 162, 1)',
      };

  const base = isDark ? DARK_BASE : LIGHT_BASE;
  const textFor = (background: string) => pickTextColor(background, base);

  return `
    ::highlight(${HIGHLIGHT_NAMES.positive}) {
      background-color: ${colors.positiveBackground};
      color: ${textFor(colors.positiveBackground)};
    }

    ::highlight(${HIGHLIGHT_NAMES.negative}) {
      background-color: ${colors.negativeBackground};
      color: ${textFor(colors.negativeBackground)};
    }

    ::highlight(${HIGHLIGHT_NAMES.orange}) {
      background-color: ${colors.orangeBackground};
      color: ${textFor(colors.orangeBackground)};
    }

    ::highlight(${HIGHLIGHT_NAMES.purple}) {
      background-color: ${colors.purpleBackground};
      color: ${textFor(colors.purpleBackground)};
    }
  `;
};

export const observeThemeChanges = (
  themeMode: HighlightThemeMode,
  onChange: () => void,
): (() => void) => {
  if (themeMode !== 'auto') {
    return () => {};
  }

  const darkThemeMedia =
    globalThis.matchMedia?.(DARK_THEME_MEDIA_QUERY) ?? null;
  const observer = new MutationObserver(onChange);

  const observeTarget = (target: Element | null): void => {
    if (!target) {
      return;
    }

    observer.observe(target, {
      attributes: true,
      attributeFilter: [...OBSERVED_THEME_ATTRIBUTES],
    });
  };

  observeTarget(document.documentElement);
  observeTarget(document.body);
  darkThemeMedia?.addEventListener('change', onChange);

  return () => {
    observer.disconnect();
    darkThemeMedia?.removeEventListener('change', onChange);
  };
};
