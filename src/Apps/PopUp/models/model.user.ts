// User profile
export interface UserJobProfile {
  id: string | null;
  briefDescription: string | null;
  aboutMe: string | null;
  additionalSkills: string[] | null;
  softSkills: string[] | null;
  languages: string[] | null;
  linkedInUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  userJobProfileExperiences: UserJobProfileExperience[] | null;
  userJobProfileSkills: UserJobProfileSkill[] | null;
  userId: string | null;
}

// User job profile
export interface UserJobProfileExperience {
  id: string | null;
  position: string | null;
  company: string | null;
  startDate: string | null;
  endDate: string | null;
  jobType: string | null;
  location: string | null;
  description: string | null;
}

// User job profile skill
export interface UserJobProfileSkill {
  id: string | null;
  skillName: string | null;
  yearsOfExperience: number | null;
}
