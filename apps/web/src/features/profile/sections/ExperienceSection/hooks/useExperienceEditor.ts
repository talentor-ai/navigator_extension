import { useState } from 'react';
import type { components } from '@talentor/contracts';
import { removeExperience, reorder } from '@/features/profile/collections';
import type { CandidateProfileV1 } from '../types';

type ExperienceDraft = {
  company: string;
  position: string;
  startDate: string;
};

type ExperienceAddErrors = Partial<Record<keyof ExperienceDraft, string>>;

const INITIAL_DRAFT: ExperienceDraft = {
  company: '',
  position: '',
  startDate: '',
};

function isValidYearMonth(value: string): boolean {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return false;
  return true;
}

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

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [draft, setDraft] = useState<ExperienceDraft>({ ...INITIAL_DRAFT });
  const [addErrors, setAddErrors] = useState<ExperienceAddErrors>({});
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  const openAdd = () => {
    setDraft({ ...INITIAL_DRAFT });
    setAddErrors({});
    setIsAddOpen(true);
  };

  const closeAdd = () => {
    setIsAddOpen(false);
    setAddErrors({});
  };

  const handleDraftChange = (field: keyof ExperienceDraft, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (addErrors[field]) {
      setAddErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddConfirm = () => {
    const company = draft.company.trim();
    const position = draft.position.trim();
    const startDate = draft.startDate.trim();
    const errors: ExperienceAddErrors = {};
    if (!company) errors.company = 'Company is required';
    if (!position) errors.position = 'Position is required';
    if (!startDate) errors.startDate = 'Start date is required';
    else if (!isValidYearMonth(startDate)) errors.startDate = 'Use YYYY-MM';
    if (Object.keys(errors).length > 0) {
      setAddErrors(errors);
      return;
    }
    const newExperience = {
      id: crypto.randomUUID(),
      company,
      position,
      startDate,
      achievements: [] as string[],
      skillRefs: [] as string[],
    } as components['schemas']['Experience'];
    const next: CandidateProfileV1 = {
      ...profile,
      experience: [...profile.experience, newExperience],
    };
    const result = onProfileChange(next);
    if (result && typeof (result as Promise<void>).then === 'function') {
      void (result as Promise<void>)
        .then(() => {
          setIsAddOpen(false);
          setDraft({ ...INITIAL_DRAFT });
          setAddErrors({});
        })
        .catch(() => {
          // keep dialog open, error surfaced via parent pending/saveError
        });
      return;
    }
    setIsAddOpen(false);
    setDraft({ ...INITIAL_DRAFT });
    setAddErrors({});
  };

  const requestRemove = (id: string) => setPendingRemoveId(id);
  const cancelRemove = () => setPendingRemoveId(null);

  const confirmRemove = () => {
    if (!pendingRemoveId) return;
    const next = removeExperience(profile, pendingRemoveId);
    if (next === profile) {
      setPendingRemoveId(null);
      return;
    }
    const result = onProfileChange(next);
    if (result && typeof (result as Promise<void>).then === 'function') {
      void (result as Promise<void>)
        .then(() => setPendingRemoveId(null))
        .catch(() => {
          // keep dialog open on failure
        });
      return;
    }
    setPendingRemoveId(null);
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    const nextExperience = reorder(profile.experience, oldIndex, newIndex);
    if (nextExperience === profile.experience) return;
    const next: CandidateProfileV1 = { ...profile, experience: nextExperience };
    const result = onProfileChange(next);
    if (result && typeof (result as Promise<void>).then === 'function') {
      void (result as Promise<void>).catch(() => {
        // attach rejection handling without swallowing parent query error state
      });
    }
    return result as unknown as void;
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
    isAddOpen,
    openAdd,
    closeAdd,
    draft,
    addErrors,
    handleDraftChange,
    handleAddConfirm,
    pendingRemoveId,
    requestRemove,
    cancelRemove,
    confirmRemove,
    handleReorder,
  };
}
