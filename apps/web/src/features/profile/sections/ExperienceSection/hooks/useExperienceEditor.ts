import type { components } from '@talentor/contracts';
import type { CandidateProfileV1 } from '../types';

export function useExperienceEditor(
  profile: CandidateProfileV1,
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>,
) {
  const updateCompany = (id: string, value: string) => {
    const nextExperience = profile.experience.map((e) =>
      e.id === id ? { ...e, company: value } : e,
    );
    const next: CandidateProfileV1 = { ...profile, experience: nextExperience };
    return onProfileChange(next);
  };

  const updatePosition = (id: string, value: string) => {
    const nextExperience = profile.experience.map((e) =>
      e.id === id ? { ...e, position: value } : e,
    );
    const next: CandidateProfileV1 = { ...profile, experience: nextExperience };
    return onProfileChange(next);
  };

  const updateEmploymentType = (id: string, value: string) => {
    const nextType =
      value === '' ? null : (value as components['schemas']['EmploymentType']);
    const nextExperience = profile.experience.map((e) =>
      e.id === id ? { ...e, employmentType: nextType } : e,
    );
    const next: CandidateProfileV1 = { ...profile, experience: nextExperience };
    return onProfileChange(next);
  };

  const updateLocationType = (id: string, value: string) => {
    const nextType =
      value === '' ? null : (value as components['schemas']['LocationType']);
    const nextExperience = profile.experience.map((e) =>
      e.id === id ? { ...e, locationType: nextType } : e,
    );
    const next: CandidateProfileV1 = { ...profile, experience: nextExperience };
    return onProfileChange(next);
  };

  const updateStartDate = (id: string, value: string) => {
    const nextExperience = profile.experience.map((e) =>
      e.id === id ? { ...e, startDate: value } : e,
    );
    const next: CandidateProfileV1 = { ...profile, experience: nextExperience };
    return onProfileChange(next);
  };

  const updateEndDate = (id: string, value: string) => {
    const nextEnd = value.trim() === '' ? null : value;
    const nextExperience = profile.experience.map((e) =>
      e.id === id ? { ...e, endDate: nextEnd } : e,
    );
    const next: CandidateProfileV1 = { ...profile, experience: nextExperience };
    return onProfileChange(next);
  };

  const updateSummary = (id: string, value: string) => {
    const nextSummary = value.trim() === '' ? null : value;
    const nextExperience = profile.experience.map((e) =>
      e.id === id ? { ...e, summary: nextSummary } : e,
    );
    const next: CandidateProfileV1 = { ...profile, experience: nextExperience };
    return onProfileChange(next);
  };

  const updateResponsibility = (id: string, index: number, value: string) => {
    const nextExperience = profile.experience.map((e) => {
      if (e.id !== id) return e;
      const prev = e.responsibilities ?? [];
      const nextResp = prev.map((r, i) => (i === index ? value : r));
      return { ...e, responsibilities: nextResp };
    });
    const next: CandidateProfileV1 = { ...profile, experience: nextExperience };
    return onProfileChange(next);
  };

  const updateAchievement = (id: string, index: number, value: string) => {
    const nextExperience = profile.experience.map((e) => {
      if (e.id !== id) return e;
      const nextAch = e.achievements.map((a, i) => (i === index ? value : a));
      return { ...e, achievements: nextAch };
    });
    const next: CandidateProfileV1 = { ...profile, experience: nextExperience };
    return onProfileChange(next);
  };

  return {
    updateCompany,
    updatePosition,
    updateEmploymentType,
    updateLocationType,
    updateStartDate,
    updateEndDate,
    updateSummary,
    updateResponsibility,
    updateAchievement,
  };
}
