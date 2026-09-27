import { useState } from 'react';
import type { components } from '@talentor/contracts';
import { removeExperience, reorder } from '@/features/profile/collections';
import type { CandidateProfileV1 } from '../types';
type ExperienceDraft = { company: string; position: string; startDate: string };
type ExperienceAddErrors = Partial<Record<keyof ExperienceDraft, string>>;
const INITIAL_DRAFT: ExperienceDraft = {
  company: '',
  position: '',
  startDate: '',
};
function isValidYearMonth(v: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(v);
}
export function useExperienceEditor(
  profile: CandidateProfileV1,
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>,
) {
  const patch = (
    id: string,
    patchFn: (
      e: components['schemas']['Experience'],
    ) => components['schemas']['Experience'],
  ) => {
    const nextExperience = profile.experience.map((e) =>
      e.id === id ? patchFn(e) : e,
    );
    return onProfileChange({ ...profile, experience: nextExperience });
  };
  const updateCompany = (id: string, v: string) =>
    patch(id, (e) => ({ ...e, company: v }));
  const updatePosition = (id: string, v: string) =>
    patch(id, (e) => ({ ...e, position: v }));
  const updateEmploymentType = (id: string, v: string) =>
    patch(id, (e) => ({
      ...e,
      employmentType:
        v === '' ? null : (v as components['schemas']['EmploymentType']),
    }));
  const updateLocationType = (id: string, v: string) =>
    patch(id, (e) => ({
      ...e,
      locationType:
        v === '' ? null : (v as components['schemas']['LocationType']),
    }));
  const updateCompanyLocationField = (
    id: string,
    field: 'city' | 'region' | 'countryCode',
    v: string,
  ) =>
    patch(id, (e) => ({
      ...e,
      companyLocation: {
        ...(e.companyLocation ?? {}),
        [field]: v.trim() === '' ? null : v,
      } as components['schemas']['Location'],
    }));
  const updateCompanyLocationCity = (id: string, v: string) =>
    updateCompanyLocationField(id, 'city', v);
  const updateCompanyLocationRegion = (id: string, v: string) =>
    updateCompanyLocationField(id, 'region', v);
  const updateCompanyLocationCountryCode = (id: string, v: string) =>
    updateCompanyLocationField(id, 'countryCode', v);
  const updateStartDate = (id: string, v: string) =>
    patch(id, (e) => ({ ...e, startDate: v }));
  const updateEndDate = (id: string, v: string) =>
    patch(id, (e) => ({ ...e, endDate: v.trim() === '' ? null : v }));
  const updateSummary = (id: string, v: string) =>
    patch(id, (e) => ({ ...e, summary: v.trim() === '' ? null : v }));
  const updateResponsibility = (id: string, idx: number, v: string) =>
    patch(id, (e) => ({
      ...e,
      responsibilities: (e.responsibilities ?? []).map((r, i) =>
        i === idx ? v : r,
      ),
    }));
  const addResponsibility = (id: string, v: string) =>
    patch(id, (e) => ({
      ...e,
      responsibilities: [...(e.responsibilities ?? []), v],
    }));
  const removeResponsibility = (id: string, idx: number) =>
    patch(id, (e) => ({
      ...e,
      responsibilities: (e.responsibilities ?? []).filter((_, i) => i !== idx),
    }));
  const updateAchievement = (id: string, idx: number, v: string) =>
    patch(id, (e) => ({
      ...e,
      achievements: e.achievements.map((a, i) => (i === idx ? v : a)),
    }));
  const addAchievement = (id: string, v: string) =>
    patch(id, (e) => ({ ...e, achievements: [...e.achievements, v] }));
  const removeAchievement = (id: string, idx: number) =>
    patch(id, (e) => ({
      ...e,
      achievements: e.achievements.filter((_, i) => i !== idx),
    }));
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
    if (addErrors[field])
      setAddErrors((prev) => ({ ...prev, [field]: undefined }));
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
      companyLocation: null,
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
        .catch(() => {});
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
        .catch(() => {});
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
      void (result as Promise<void>).catch(() => {});
    }
    return result as unknown as void;
  };
  return {
    updateCompany,
    updatePosition,
    updateEmploymentType,
    updateLocationType,
    updateCompanyLocationCity,
    updateCompanyLocationRegion,
    updateCompanyLocationCountryCode,
    updateStartDate,
    updateEndDate,
    updateSummary,
    updateResponsibility,
    addResponsibility,
    removeResponsibility,
    updateAchievement,
    addAchievement,
    removeAchievement,
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
