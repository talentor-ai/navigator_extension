export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const getViewportSize = () => ({
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
});
