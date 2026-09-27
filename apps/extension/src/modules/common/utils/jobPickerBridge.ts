/**
 * Window `postMessage` protocol between the popup iframe and the content-script
 * job picker. The iframe posts start/stop to the host page; the picker replies
 * with the picked text or a cancellation. Messages are transient (never stored).
 */
export const JOB_PICKER_START = 'talentor:job-picker:start';
export const JOB_PICKER_STOP = 'talentor:job-picker:stop';
export const JOB_PICKER_PICKED = 'talentor:job-picker:picked';
export const JOB_PICKER_CANCELLED = 'talentor:job-picker:cancelled';

export interface JobPickerStartMessage {
  type: typeof JOB_PICKER_START;
}

export interface JobPickerStopMessage {
  type: typeof JOB_PICKER_STOP;
}

export interface JobPickerPickedMessage {
  type: typeof JOB_PICKER_PICKED;
  text: string;
}

export interface JobPickerCancelledMessage {
  type: typeof JOB_PICKER_CANCELLED;
}

export type JobPickerRequestMessage =
  JobPickerStartMessage | JobPickerStopMessage;

export type JobPickerResponseMessage =
  JobPickerPickedMessage | JobPickerCancelledMessage;

export const isExtensionOrigin = (origin: string): boolean =>
  origin.startsWith('chrome-extension://');

export const isJobPickerRequest = (
  value: unknown,
): value is JobPickerRequestMessage => {
  if (!value || typeof value !== 'object') return false;
  const type = (value as { type?: unknown }).type;
  return type === JOB_PICKER_START || type === JOB_PICKER_STOP;
};
