import { get } from 'lodash';
import { UserJobProfile } from '@modules/popup/models/model.user';
import { useJobProfile, useSessionStore } from '@modules/popup/store';
import { useProfilesList } from '@modules/popup/hooks';
import ControlPanel from './components/ControlPanel';
import InformationGrid from '@modules/popup/containers/InformationGrid';
import { H1 } from '@modules/popup/components';
import { useEffect } from 'react';

const ProfileList = () => {
  const { session } = useSessionStore();
  const { jobProfileIdSelected, setJobProfile } = useJobProfile();
  const profileList: UserJobProfile[] =
    get(session, 'userJobProfile', []) || [];
  const profileSelected =
    profileList.find((profile) => profile.id === jobProfileIdSelected) || null;

  const { profileList: apiProfiles } = useProfilesList();
  const profileIds = apiProfiles.map((profile) => profile.id).join('|');
  const firstValidId = apiProfiles.find((profile) => profile.id)?.id;

  useEffect(() => {
    if (!profileIds || !firstValidId) {
      return;
    }
    if (!jobProfileIdSelected) {
      setJobProfile(firstValidId);
      return;
    }
    if (!profileIds.split('|').includes(jobProfileIdSelected)) {
      setJobProfile(firstValidId);
    }
  }, [jobProfileIdSelected, profileIds, firstValidId, setJobProfile]);

  return (
    <div className="">
      <ControlPanel />
      {profileSelected && jobProfileIdSelected && (
        <>
          <H1 className="tai:my-6 tai:text-txt2">Información del perfil</H1>
          <InformationGrid jobProfile={profileSelected} />
        </>
      )}
    </div>
  );
};

export default ProfileList;
