import { FormComponent, H1 } from '@popup:components';
import { UserJobProfile } from '@popup:models/model.user';
import { useJobProfile, useSessionStore } from '@popup:store';
import { get, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { JOB_PROFILE_FIELDS } from '../constants';
import { PROFILE_SETTINGS_PATH } from '@popup:constants/paths';

const EditProfileList = () => {
  const { id = '' } = useParams();
  const { session } = useSessionStore();
  const navigate = useNavigate();
  const { jobProfileIdSelected } = useJobProfile();
  const [profileSelected, setProfileSelected] = useState<UserJobProfile | null>(
    null,
  );

  useEffect(() => {
    if (!isEmpty(id)) {
      const profileList: UserJobProfile[] =
        get(session, 'userJobProfile', []) || [];
      const profileSelected =
        profileList.find((profile) => profile.id === jobProfileIdSelected) ||
        null;

      setProfileSelected(profileSelected);
    }
  }, [id, jobProfileIdSelected, session]);

  console.log(profileSelected);

  return (
    <div key={profileSelected?.id}>
      <H1 className="text-txt2 my-8 px-4">Agregar un perfil de trabajo</H1>
      <FormComponent
        className="my-8 flex flex-col justify-center w-full px-4"
        fieldProps={JOB_PROFILE_FIELDS}
        onSubmit={(form) => {
          console.log(form);
        }}
        onCancel={() => {
          setProfileSelected(null);
          navigate(PROFILE_SETTINGS_PATH);
        }}
        onWatch={() => {}}
        defaultValues={profileSelected ? profileSelected : {}}
      />
    </div>
  );
};

export default EditProfileList;
