import FloatingProfileBar from './components/FloatingProfileBar';
import ProfileHeader from './components/ProfileHeader';
import ContactDetails from './components/ContactDetails';
import SummarySection from './sections/SummarySection';
import ExperienceSection from './sections/ExperienceSection';
import ProjectsSection from './sections/ProjectsSection';
import SkillsSection from './sections/SkillsSection';
import LanguagesSection from './sections/LanguagesSection';
import EducationSection from './sections/EducationSection';
import CertificationsSection from './sections/CertificationsSection';
import { MOCK_PROFILE } from './profile.constants';

const ProfilePage = () => {
  const { profile } = MOCK_PROFILE;

  return (
    <div className="min-h-screen bg-background">
      <FloatingProfileBar />
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-6 pt-20">
        <div className="grid grid-cols-12 gap-6">
          <main className="col-span-12 space-y-6 lg:col-span-8">
            <ProfileHeader />
            <SummarySection profile={profile} />
            <ExperienceSection profile={profile} />
            <ProjectsSection profile={profile} />
          </main>

          <aside className="col-span-12 space-y-6 lg:col-span-4">
            <ContactDetails />
            <SkillsSection profile={profile} />
            <LanguagesSection profile={profile} />
            <EducationSection profile={profile} />
            <CertificationsSection profile={profile} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
