import { get } from 'lodash';
import { Select } from '@popup/components/FormComponent/components';
import { ButtonIcon } from '@popup:components';
import { useSessionStore, useJobProfile } from '@popup:store';
import { UserJobProfile } from '@popup:models/model.user';
import { useNavigate } from 'react-router-dom';
import {
  PROFILE_CONFIG_PATH,
  PROFILE_SETTINGS_PATH,
} from '@popup:constants/paths';

const ControlPanel = () => {
  const navigate = useNavigate();
  const { session } = useSessionStore();
  const { setJobProfile, jobProfileIdSelected } = useJobProfile();

  const profileList: UserJobProfile[] =
    get(session, 'userJobProfile', []) || [];
  const profileoptions = profileList.map(
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

  return (
    <div className="">
      <p className="mb-2 text-txt3">Seleccionar perfil</p>
      <div className="grid grid-cols-[13rem_2.3rem_2.3rem_2.3rem] gap-2 mb-4">
        <Select
          className="w-[13rem]"
          options={profileoptions}
          onChange={handleProfileChange}
          defaultValue={jobProfileIdSelected}
        />
        <ButtonIcon icon="plus" onClick={redirectToCreate} />
        <ButtonIcon icon="edit" onClick={redirectToEdit} />
        <ButtonIcon icon="delete" />
      </div>
    </div>
  );
};

export default ControlPanel;
