import { FormComponent, H1 } from '@popup:components';
import { UserJobProfile } from '@popup:models/model.user';
import { useJobProfile, useSessionStore } from '@popup:store';
import { get, isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jobProfileFields } from '../constants';

const EditProfileList = () => {
  const { id = '' } = useParams();
  const { session } = useSessionStore();
  const { jobProfileIdSelected } = useJobProfile();

  useEffect(() => {
    if (!isEmpty(id)) {
      const profileList: UserJobProfile[] =
        get(session, 'userJobProfile', []) || [];
      const profileSelected =
        profileList.find((profile) => profile.id === jobProfileIdSelected) ||
        null;
    }
  }, [id, jobProfileIdSelected]);

  return (
    <div>
      <H1 className="text-txt2 my-8 px-4">Agregar un perfil de trabajo</H1>
      <FormComponent
        className="my-8 flex flex-col justify-center w-full px-4"
        fieldProps={jobProfileFields}
        onSubmit={() => {}}
        onCancel={() => {}}
        onWatch={() => {}}
        defaultValues={{}}
      />
    </div>
  );
};

export default EditProfileList;
