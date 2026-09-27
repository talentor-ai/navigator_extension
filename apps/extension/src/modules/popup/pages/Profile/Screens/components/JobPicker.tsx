import { useTranslation } from 'react-i18next';
import type { UseFormRegister } from 'react-hook-form';
import { Textarea } from '@modules/popup/components';
import { InputFieldType } from '@modules/popup/models/model.form';
import type { JobPickerFormValues } from '../hooks/useJobPickerForm';

interface JobPickerProps {
  register: UseFormRegister<JobPickerFormValues>;
  isPickingAJob: boolean;
}

/** Job description target of the picker trigger rendered next to the selector. */
const JobPicker = ({ register, isPickingAJob }: JobPickerProps) => {
  const { t } = useTranslation();

  return (
    <section className="tai:mb-4 tai:flex tai:flex-col tai:gap-2">
      <h2 className="tai:text-medium tai:pt-5 tai:font-semibold tai:text-txt2">
        {t('profile.jobPicker.title')}
      </h2>
      {isPickingAJob && (
        <p className="tai:text-medium tai:text-txt3">
          {t('profile.jobPicker.pickingHint')}
        </p>
      )}
      <Textarea
        name="jobDescription"
        type={InputFieldType.textarea}
        placeholder={t('profile.jobPicker.placeholder')}
        register={register}
      />
    </section>
  );
};

export default JobPicker;
