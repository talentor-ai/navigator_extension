import { Select } from '@modules/popup/components/FormComponent/components';
import { ButtonIcon } from '@modules/popup/components';
import { useJobProfile } from '@modules/popup/store';
import { useProfilesList } from '@modules/popup/hooks';
import { useTranslation } from 'react-i18next';

interface ProfileSelectorProps {
  onStartPicking: () => void;
  isPickingAJob: boolean;
}

const ProfileSelector = ({
  onStartPicking,
  isPickingAJob,
}: ProfileSelectorProps) => {
  const { t } = useTranslation();
  const { setJobProfile, jobProfileIdSelected } = useJobProfile();
  const { profileList, isLoading } = useProfilesList();

  const profileOptions = profileList.map((profile) => ({
    value: profile.id,
    label: <span>{profile.name || ''}</span>,
  }));

  const options = isLoading
    ? [{ label: <p>{t('profile.loadingProfiles')}</p>, value: '0' }]
    : profileOptions.length > 0
      ? profileOptions
      : [{ label: <p>{t('profile.noProfiles')}</p>, value: '0' }];

  return (
    <div className="">
      <h2 className="tai:text-medium tai:font-semibold tai:text-txt2 tai:mt-5">
        {t('profile.selectProfile')}
      </h2>
      <div className="tai:flex tai:items-center tai:gap-2">
        <Select
          className="tai:w-[13rem]"
          options={options}
          onChange={setJobProfile}
          value={jobProfileIdSelected}
        />
        {/* Pick a job posting from the host page to fill the job description. */}
        <ButtonIcon
          icon="aim"
          aria-label={t('profile.jobPicker.button')}
          disabled={isPickingAJob}
          onClick={onStartPicking}
        />
        {/* Placeholder action: intentional no-op, reserved for future behavior. */}
        <ButtonIcon icon="magic" aria-label="Magic" />
      </div>
    </div>
  );
};

export default ProfileSelector;
