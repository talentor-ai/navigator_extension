import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Textarea } from '@modules/popup/components';
import { InputFieldType } from '@modules/popup/models/model.form';
import useJobPicker from './hooks/useJobPicker';

interface JobPickerFormValues {
  jobDescription: string;
}

const JobPicker = () => {
  const { t } = useTranslation();
  const { register, setValue } = useForm<JobPickerFormValues>({
    defaultValues: { jobDescription: '' },
  });
  const { isPickingAJob, startPicking } = useJobPicker({ setValue });

  return (
    <section className="tai:mb-4 tai:flex tai:flex-col tai:gap-2">
      <h2 className="tai:text-body tai:font-medium tai:text-txt2">
        {t('profile.jobPicker.title')}
      </h2>
      <Button
        type="button"
        icon="briefcase"
        fontWeight="normal"
        textSize="body"
        className="tai:bg-tertiary"
        disabled={isPickingAJob}
        onClick={startPicking}
      >
        {t('profile.jobPicker.button')}
      </Button>
      {isPickingAJob && (
        <p className="tai:text-body tai:text-txt3">
          {t('profile.jobPicker.pickingHint')}
        </p>
      )}
      <Textarea
        name="jobDescription"
        type={InputFieldType.textarea}
        textSize="body"
        placeholder={t('profile.jobPicker.placeholder')}
        register={register}
      />
    </section>
  );
};

export default JobPicker;
