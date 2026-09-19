import { Select } from '@modules/popup/components/FormComponent/components';
import { Button, ButtonIcon, Dialog } from '@modules/popup/components';
import { useJobProfile } from '@modules/popup/store';
import { useProfilesList } from '@modules/popup/hooks';
import { useNavigate } from 'react-router-dom';
import {
  MAIN_PATH,
  PROFILE_CONFIG_PATH,
  PROFILE_SETTINGS_PATH,
} from '@modules/popup/constants/paths';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import useDeleteProfile from '@modules/popup/pages/Profile/hooks/useDeleteProfile';

const ControlPanel = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setJobProfile, jobProfileIdSelected } = useJobProfile();
  const [isDeleteProfileOpen, setIsDeleteProfileOpen] = useState(false);
  const { mutate: deleteProfile } = useDeleteProfile();
  const { profileList, isLoading } = useProfilesList();

  const profileOptions = profileList.map((profile) => ({
    value: profile.id,
    label: <span>{profile.name || ''}</span>,
  }));

  // -------------------------  Handlers
  const handleProfileChange = (value: string) => {
    setJobProfile(value);
  };
  const redirectToEdit = () => {
    navigate(
      `${PROFILE_SETTINGS_PATH}/${PROFILE_CONFIG_PATH}/${jobProfileIdSelected}`,
    );
  };
  const redirectToCreate = () => {
    navigate(`${PROFILE_SETTINGS_PATH}/${PROFILE_CONFIG_PATH}`);
  };
  const handleDeleteProfile = () => {
    setIsDeleteProfileOpen(true);
  };
  const handleCloseDeleteProfile = () => {
    setIsDeleteProfileOpen(false);
  };
  const handleConfirmDeleteProfile = () => {
    if (!jobProfileIdSelected) return;
    deleteProfile(jobProfileIdSelected);
    handleCloseDeleteProfile();
    navigate(MAIN_PATH);
  };

  return (
    <div className="">
      <p className="tai:mb-2 tai:text-txt3">Seleccionar perfil</p>
      <div className="tai:grid tai:grid-cols-[13rem_2.3rem_2.3rem_2.3rem] tai:gap-2 tai:mb-4">
        <Select
          className="tai:w-[13rem]"
          options={
            isLoading
              ? [{ label: <p>Cargando...</p>, value: '0' }]
              : profileOptions.length > 0
                ? profileOptions
                : [{ label: <p>No hay perfiles</p>, value: '0' }]
          }
          onChange={handleProfileChange}
          value={jobProfileIdSelected}
        />
        <ButtonIcon icon="plus" onClick={redirectToCreate} />
        <ButtonIcon icon="edit" onClick={redirectToEdit} />
        <ButtonIcon icon="delete" onClick={handleDeleteProfile} />
      </div>
      <Dialog
        isOpen={isDeleteProfileOpen}
        onClose={handleCloseDeleteProfile}
        size="medium"
        title={t('profile.deleteProfile')}
      >
        <div className="tai:mb-4">
          <p>{t('profile.deleteProfileDescription')}</p>
        </div>
        <div className="tai:flex tai:justify-end tai:gap-2">
          <Button
            className="tai:bg-errorColor tai:text-txt1"
            onClick={handleConfirmDeleteProfile}
          >
            {t('profile.deleteProfileConfirm')}
          </Button>
          <Button className="tai:bg-txt3" onClick={handleCloseDeleteProfile}>
            {t('profile.deleteProfileCancel')}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default ControlPanel;
