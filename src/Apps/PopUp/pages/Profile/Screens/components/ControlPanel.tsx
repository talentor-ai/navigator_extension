import { get } from 'lodash';
import { Select } from '@popup/components/FormComponent/components';
import { ButtonIcon } from '@popup:components';
import { useSessionStore, useJobProfile } from '@popup:store';
import { UserJobProfile } from '@popup:models/model.user';

const ControlPanel = () => {
  const { session } = useSessionStore();
  const { setJobProfile, jobProfileIdSelected } = useJobProfile();

  const profileList: UserJobProfile[] = get(session, 'userJobProfile', []);
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
        <ButtonIcon icon="plus" />
        <ButtonIcon icon="edit" />
        <ButtonIcon icon="delete" />
      </div>
    </div>
  );
};

export default ControlPanel;
