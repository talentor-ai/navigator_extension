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

export const buildHighlightStyle = (isDark: boolean): string => {
  const colors = isDark
    ? {
        positiveBackground: 'rgba(74, 222, 128, 0.24)',
        positiveText: '#d8ffe2',
        negativeBackground: 'rgba(248, 113, 113, 0.26)',
        negativeText: '#ffe1e1',
        orangeBackground: 'rgba(251, 191, 36, 0.28)',
        orangeText: '#fff0c2',
        purpleBackground: 'rgba(192, 132, 252, 0.28)',
        purpleText: '#f3e8ff',
      }
    : {
        positiveBackground: 'rgba(46, 125, 50, 0.18)',
        positiveText: '#1b5e20',
        negativeBackground: 'rgba(198, 40, 40, 0.18)',
        negativeText: '#8e0000',
        orangeBackground: 'rgba(245, 124, 0, 0.2)',
        orangeText: '#a84300',
        purpleBackground: 'rgba(123, 31, 162, 0.2)',
        purpleText: '#6a1b9a',
      };

  return `
    ::highlight(${HIGHLIGHT_NAMES.positive}) {
      background-color: ${colors.positiveBackground};
      color: ${colors.positiveText};
    }

    ::highlight(${HIGHLIGHT_NAMES.negative}) {
      background-color: ${colors.negativeBackground};
      color: ${colors.negativeText};
    }

    ::highlight(${HIGHLIGHT_NAMES.orange}) {
      background-color: ${colors.orangeBackground};
      color: ${colors.orangeText};
    }

    ::highlight(${HIGHLIGHT_NAMES.purple}) {
      background-color: ${colors.purpleBackground};
      color: ${colors.purpleText};
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
