import { UserJobProfile } from '@popup:models/model.user';
import { useJobProfile, useSessionStore } from '@popup:store';
import { get, isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

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

  return <div>EditProfileList</div>;
};

export default EditProfileList;
