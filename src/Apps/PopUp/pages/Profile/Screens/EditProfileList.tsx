import { FormComponent, H1 } from '@popup:components';
import { UserJobProfile } from '@popup:models/model.user';
import { useJobProfile, useSessionStore } from '@popup:store';
import { cloneDeep, get, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { JOB_PROFILE_FIELDS } from '../constants';
import { MAIN_PATH } from '@popup:constants/paths';
import useEditJobProfile from '@popup:pages/Profile/hooks/useEditJobProfile';
import useCreateProfile from '@popup:pages/Profile/hooks/useCreateProfile';

const EditProfileList = () => {
  const { id = '' } = useParams();
  const { session } = useSessionStore();
  const navigate = useNavigate();
  const { jobProfileIdSelected } = useJobProfile();
  const { mutate: updateJobProfile } = useEditJobProfile();
  const { mutate: createJobProfile } = useCreateProfile();
  const [profileSelected, setProfileSelected] = useState<UserJobProfile | null>(
    null,
  );

  const onSubmit = (form: Record<string, any>) => {
    const formToSend = cloneDeep(form);

    const languages = formToSend.languages;
    if (languages?.split) {
      formToSend.languages = languages
        .split(',')
        .map((lang: string) => lang.trim());
    }

    const additionalSkills = formToSend.additionalSkills;
    if (additionalSkills?.split) {
      formToSend.additionalSkills = additionalSkills
        .split(',')
        .map((skill: string) => skill.trim());
    }

    if (formToSend.id) {
      updateJobProfile({
        ...formToSend,
        id: jobProfileIdSelected,
        userId: session?.id,
      } as UserJobProfile);
    } else {
      createJobProfile(formToSend as UserJobProfile);
    }
    setProfileSelected(null);
    navigate(MAIN_PATH);
  };

  const onCancel = () => {
    setProfileSelected(null);
    navigate(MAIN_PATH);
  };

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

  return (
    <div key={profileSelected?.id}>
      <H1 className="text-txt2 my-8 px-4">Agregar un perfil de trabajo</H1>
      <FormComponent
        className="my-8 flex flex-col justify-center w-full px-4"
        fieldProps={JOB_PROFILE_FIELDS}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onWatch={() => {}}
        defaultValues={profileSelected ? profileSelected : {}}
      />
    </div>
  );
};

export default EditProfileList;
