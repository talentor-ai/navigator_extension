import { get } from 'lodash';
import { UserJobProfile } from '@popup:models/model.user';
import { useJobProfile, useSessionStore } from '@popup:store';
import ControlPanel from './components/ControlPanel';
import InformationGrid from '@popup/containers/InformationGrid';
import { H1 } from '@popup:components';
import { useEffect } from 'react';

const ProfileList = () => {
  const { session } = useSessionStore();
  const { jobProfileIdSelected, setJobProfile } = useJobProfile();
  const profileList: UserJobProfile[] = get(session, 'userJobProfile', []);
  const profileSelected =
    profileList.find((profile) => profile.id === jobProfileIdSelected) || null;

  useEffect(() => {
    if (!jobProfileIdSelected) {
      const firstProfile = profileList[0];
      if (firstProfile.id) {
        setJobProfile(firstProfile.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="">
      <ControlPanel />
      {profileSelected && jobProfileIdSelected && (
        <>
          <H1 className="my-6 text-txt2">Información del perfil</H1>
          <InformationGrid jobProfile={profileSelected} />
        </>
      )}
    </div>
  );
};

export default ProfileList;
