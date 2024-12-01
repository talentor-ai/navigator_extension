import { isEmpty } from 'lodash';
import { UserJobProfile } from '@popup:models/model.user';
import { useSessionStore } from '@popup:store';
import ControlPanel from './components/ControlPanel';

const ProfileList = () => {
  const { session } = useSessionStore();
  const profileList = session?.userJobProfile || [];
  return (
    <div className="">
      <ControlPanel />
      {!isEmpty(profileList) ? (
        profileList.map((jobProfile: UserJobProfile) => (
          <p key={jobProfile.id}>{jobProfile.briefDescription}</p>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProfileList;
