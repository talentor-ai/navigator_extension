import {
  JOB_PICKER_CANCELLED,
  JOB_PICKER_PICKED,
} from '@common/utils/jobPickerBridge';

const HOST_ID = 'talentor-ai-root';
const OUTLINE_COLOR = '#fcaf58';

interface HoveredElement {
  element: HTMLElement;
  previousStyle: string | null;
}

interface ActivePicker {
  source: Window;
  hovered: HoveredElement | null;
}

let activePicker: ActivePicker | null = null;

const isPickable = (target: EventTarget | null): target is HTMLElement => {
  if (!(target instanceof HTMLElement)) return false;

  const tag = target.tagName.toLowerCase();
  if (tag === 'html' || tag === 'body') return false;
  if (target.closest(`#${HOST_ID}`)) return false;

  return true;
};

const restoreHovered = (picker: ActivePicker): void => {
  const hovered = picker.hovered;
  if (!hovered) return;

  if (hovered.previousStyle === null) {
    hovered.element.removeAttribute('style');
  } else {
    hovered.element.setAttribute('style', hovered.previousStyle);
  }

  picker.hovered = null;
};

const outlineElement = (picker: ActivePicker, element: HTMLElement): void => {
  if (picker.hovered?.element === element) return;

  restoreHovered(picker);

  const previousStyle = element.getAttribute('style');
  element.style.setProperty(
    'outline',
    `2px solid ${OUTLINE_COLOR}`,
    'important',
  );
  element.style.setProperty('outline-offset', '2px', 'important');
  element.style.setProperty('cursor', 'crosshair', 'important');

  picker.hovered = { element, previousStyle };
};

const normalizeText = (text: string): string =>
  text
    .replace(/\r\n?/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const handleMouseOver = (event: MouseEvent): void => {
  if (!activePicker) return;
  if (!isPickable(event.target)) return;
  outlineElement(activePicker, event.target);
};

const handleClick = (event: MouseEvent): void => {
  const picker = activePicker;
  if (!picker || !isPickable(event.target)) return;

  event.preventDefault();
  event.stopPropagation();

  const text = normalizeText(event.target.innerText ?? '');
  picker.source.postMessage({ type: JOB_PICKER_PICKED, text }, '*');

  stopJobPicker();
};

const handleKeyDown = (event: KeyboardEvent): void => {
  const picker = activePicker;
  if (!picker || event.key !== 'Escape') return;

  event.preventDefault();
  event.stopPropagation();

  picker.source.postMessage({ type: JOB_PICKER_CANCELLED }, '*');

  stopJobPicker();
};

export const stopJobPicker = (): void => {
  if (!activePicker) return;

  restoreHovered(activePicker);
  activePicker = null;

  document.removeEventListener('mouseover', handleMouseOver, true);
  document.removeEventListener('click', handleClick, true);
  document.removeEventListener('keydown', handleKeyDown, true);
};

export const startJobPicker = (source: Window): void => {
  stopJobPicker();

  activePicker = { source, hovered: null };

  document.addEventListener('mouseover', handleMouseOver, true);
  document.addEventListener('click', handleClick, true);
  document.addEventListener('keydown', handleKeyDown, true);
};

export const isJobPickerActive = (): boolean => activePicker !== null;
