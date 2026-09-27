import type { components } from '@talentor/contracts';
import ProfileHeader from './ProfileHeader';
import ContactDetails from './ContactDetails';
import SummarySection from '../sections/SummarySection';
import ExperienceSection from '../sections/ExperienceSection';
import ProjectsSection from '../sections/ProjectsSection';
import SkillsSection from '../sections/SkillsSection';
import LanguagesSection from '../sections/LanguagesSection';
import EducationSection from '../sections/EducationSection';
import CertificationsSection from '../sections/CertificationsSection';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];

type Props = {
  profile: CandidateProfileV1;
  pending: boolean;
  readOnly: boolean;
  onProfileChange: (next: CandidateProfileV1) => Promise<void>;
};

const ProfilePageEditorLayout = ({
  profile,
  pending,
  readOnly,
  onProfileChange,
}: Props) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <main className="col-span-12 space-y-6 lg:col-span-8">
        <ProfileHeader
          profile={profile}
          onProfileChange={onProfileChange}
          pending={pending}
          readOnly={readOnly}
        />
        <SummarySection
          profile={profile}
          onProfileChange={onProfileChange}
          pending={pending}
          readOnly={readOnly}
        />
        <ExperienceSection
          profile={profile}
          onProfileChange={onProfileChange}
          pending={pending}
          readOnly={readOnly}
        />
        <ProjectsSection
          profile={profile}
          onProfileChange={onProfileChange}
          pending={pending}
          readOnly={readOnly}
        />
      </main>

      <aside className="col-span-12 space-y-6 lg:col-span-4">
        <ContactDetails
          profile={profile}
          onProfileChange={onProfileChange}
          pending={pending}
          readOnly={readOnly}
        />
        <SkillsSection
          profile={profile}
          onProfileChange={onProfileChange}
          pending={pending}
          readOnly={readOnly}
        />
        <LanguagesSection
          profile={profile}
          onProfileChange={onProfileChange}
          pending={pending}
          readOnly={readOnly}
        />
        <EducationSection
          profile={profile}
          onProfileChange={onProfileChange}
          pending={pending}
          readOnly={readOnly}
        />
        <CertificationsSection
          profile={profile}
          onProfileChange={onProfileChange}
          pending={pending}
          readOnly={readOnly}
        />
      </aside>
    </div>
  );
};

export default ProfilePageEditorLayout;
