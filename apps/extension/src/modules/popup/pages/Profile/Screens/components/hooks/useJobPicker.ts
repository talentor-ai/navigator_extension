import { useCallback, useEffect, useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';
import {
  JOB_PICKER_CANCELLED,
  JOB_PICKER_PICKED,
  JOB_PICKER_START,
  JOB_PICKER_STOP,
} from '@common/utils/jobPickerBridge';

interface JobPickerFormValues {
  jobDescription: string;
}

interface UseJobPickerOptions {
  setValue: UseFormSetValue<JobPickerFormValues>;
}

const postToHostPage = (type: string): void => {
  if (typeof window === 'undefined' || window.parent === window) return;
  window.parent.postMessage({ type }, '*');
};

/**
 * Drives the content-script element picker: starts it when the user clicks
 * "select job", fills the form with the picked text, and cancels on Escape or
 * unmount. The picker itself lives on the host page (content script).
 */
const useJobPicker = ({ setValue }: UseJobPickerOptions) => {
  const [isPickingAJob, setIsPickingAJob] = useState(false);

  const startPicking = useCallback(() => {
    setIsPickingAJob(true);
    postToHostPage(JOB_PICKER_START);
  }, []);

  const cancelPicking = useCallback(() => {
    setIsPickingAJob(false);
    postToHostPage(JOB_PICKER_STOP);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as
        { type?: unknown; text?: unknown } | null | undefined;
      if (!data || typeof data !== 'object') return;

      if (data.type === JOB_PICKER_PICKED) {
        const text = typeof data.text === 'string' ? data.text : '';
        setValue('jobDescription', text, { shouldDirty: true });
        setIsPickingAJob(false);
      } else if (data.type === JOB_PICKER_CANCELLED) {
        setIsPickingAJob(false);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      postToHostPage(JOB_PICKER_STOP);
    };
  }, [setValue]);

  useEffect(() => {
    if (!isPickingAJob) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') cancelPicking();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPickingAJob, cancelPicking]);

  return { isPickingAJob, startPicking, cancelPicking };
};

export default useJobPicker;
