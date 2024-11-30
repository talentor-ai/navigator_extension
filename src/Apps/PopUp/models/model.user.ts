export interface UserJobProfile {
  id: string;
  briefDescription: string;
  aboutMe: string;
  additionalSkills: string[];
  softSkills: string[];
  languages: string[];
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  userJobProfileExperiences: UserJobProfileExperience[];
  userJobProfileSkills: UserJobProfileSkill[];
}

export interface UserJobProfileExperience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  jobType: string;
  location: string;
  description: string;
}

export interface UserJobProfileSkill {
  id: string;
  skillName: string;
  yearsOfExperience: number;
}
