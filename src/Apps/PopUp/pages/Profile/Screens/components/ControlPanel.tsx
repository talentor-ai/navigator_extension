import { get } from 'lodash';
import { Select } from '@popup/components/FormComponent/components';
import { Button, ButtonIcon, Dialog } from '@popup:components';
import { useSessionStore, useJobProfile } from '@popup:store';
import { UserJobProfile } from '@popup:models/model.user';
import { useNavigate } from 'react-router-dom';
import {
  MAIN_PATH,
  PROFILE_CONFIG_PATH,
  PROFILE_SETTINGS_PATH,
} from '@popup:constants/paths';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import useDeleteProfile from '@popup:pages/Profile/hooks/useDeleteProfile';

const ControlPanel = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { session } = useSessionStore();
  const { setJobProfile, jobProfileIdSelected } = useJobProfile();
  const [isDeleteProfileOpen, setIsDeleteProfileOpen] = useState(false);
  const { mutate: deleteProfile } = useDeleteProfile();

  const profileList: UserJobProfile[] =
    get(session, 'userJobProfile', []) || [];
  const profileOptions = profileList.map(
    (profile: UserJobProfile, index: number) => ({
      value: profile?.id || index.toString(),
      label: <span>{profile.briefDescription}</span>,
    }),
  );

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
      <p className="ik-mb-2 ik-text-txt3">Seleccionar perfil</p>
      <div className="ik-grid ik-grid-cols-[13rem_2.3rem_2.3rem_2.3rem] ik-gap-2 ik-mb-4">
        <Select
          className="ik-w-[13rem]"
          options={
            profileOptions.length > 0
              ? profileOptions
              : [{ label: <p>No hay perfiles</p>, value: '0' }]
          }
          onChange={handleProfileChange}
          defaultValue={jobProfileIdSelected}
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
        <div className="ik-mb-4">
          <p>{t('profile.deleteProfileDescription')}</p>
        </div>
        <div className="ik-flex ik-justify-end ik-gap-2">
          <Button
            className="ik-bg-errorColor ik-text-txt1"
            onClick={handleConfirmDeleteProfile}
          >
            {t('profile.deleteProfileConfirm')}
          </Button>
          <Button className="ik-bg-txt3" onClick={handleCloseDeleteProfile}>
            {t('profile.deleteProfileCancel')}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default ControlPanel;
