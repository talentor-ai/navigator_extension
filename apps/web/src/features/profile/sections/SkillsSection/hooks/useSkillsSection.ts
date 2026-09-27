import { useCallback, useState } from 'react';
import { removeSkill, reorder } from '../../../collections';
import type { CandidateProfileV1 } from '../types';

export function useSkillsSection(
  profile: CandidateProfileV1,
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>,
) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  const openAdd = useCallback(() => {
    setAddError(null);
    setIsAddOpen(true);
  }, []);

  const closeAdd = useCallback(() => {
    setIsAddOpen(false);
    setAddError(null);
  }, []);

  const handleAdd = useCallback(
    async (name: string, category: string) => {
      const trimmedName = name.trim();
      const trimmedCategory = category.trim();
      if (!trimmedName || !trimmedCategory) {
        setAddError('Name and category are required');
        return;
      }
      const newSkill = {
        id: crypto.randomUUID(),
        name: trimmedName,
        category: trimmedCategory,
      };
      const next: CandidateProfileV1 = {
        ...profile,
        skills: [...profile.skills, newSkill],
      };
      try {
        await onProfileChange(next);
        setIsAddOpen(false);
        setAddError(null);
      } catch {
        // keep dialog open on rejection
      }
    },
    [profile, onProfileChange],
  );

  const requestRemove = useCallback((id: string) => {
    setRemoveTarget(id);
  }, []);

  const cancelRemove = useCallback(() => {
    setRemoveTarget(null);
  }, []);

  const confirmRemove = useCallback(async () => {
    if (!removeTarget) return;
    const next = removeSkill(profile, removeTarget);
    if (next === profile) {
      setRemoveTarget(null);
      return;
    }
    try {
      await onProfileChange(next);
      setRemoveTarget(null);
    } catch {
      // keep dialog open on rejection
    }
  }, [profile, onProfileChange, removeTarget]);

  const handleReorder = useCallback(
    (oldIndex: number, newIndex: number) => {
      const nextSkills = reorder(profile.skills, oldIndex, newIndex);
      if (nextSkills === profile.skills) return;
      const next: CandidateProfileV1 = { ...profile, skills: nextSkills };
      const result = onProfileChange(next);
      if (result && typeof (result as Promise<void>).then === 'function') {
        void (result as Promise<void>).catch(() => {});
      }
    },
    [profile, onProfileChange],
  );

  const updateSkillName = useCallback(
    (id: string, value: string) => {
      const nextSkills = profile.skills.map((s) =>
        s.id === id ? { ...s, name: value } : s,
      );
      const next: CandidateProfileV1 = { ...profile, skills: nextSkills };
      const result = onProfileChange(next);
      if (result && typeof (result as Promise<void>).then === 'function') {
        void (result as Promise<void>).catch(() => {});
      }
      return result;
    },
    [profile, onProfileChange],
  );

  const updateSkillCategory = useCallback(
    (id: string, value: string) => {
      const nextSkills = profile.skills.map((s) =>
        s.id === id ? { ...s, category: value } : s,
      );
      const next: CandidateProfileV1 = { ...profile, skills: nextSkills };
      const result = onProfileChange(next);
      if (result && typeof (result as Promise<void>).then === 'function') {
        void (result as Promise<void>).catch(() => {});
      }
      return result;
    },
    [profile, onProfileChange],
  );

  const updateSkillYears = useCallback(
    (id: string, value: string) => {
      const trimmed = value.trim();
      if (trimmed === '') {
        const nextSkills = profile.skills.map((s) =>
          s.id === id ? { ...s, yearsOfExperience: null } : s,
        );
        const next: CandidateProfileV1 = { ...profile, skills: nextSkills };
        const result = onProfileChange(next);
        if (result && typeof (result as Promise<void>).then === 'function') {
          void (result as Promise<void>).catch(() => {});
        }
        return result;
      }
      const parsed = Number(trimmed);
      if (!Number.isFinite(parsed) || parsed < 0) {
        return;
      }
      const nextSkills = profile.skills.map((s) =>
        s.id === id ? { ...s, yearsOfExperience: parsed } : s,
      );
      const next: CandidateProfileV1 = { ...profile, skills: nextSkills };
      const result = onProfileChange(next);
      if (result && typeof (result as Promise<void>).then === 'function') {
        void (result as Promise<void>).catch(() => {});
      }
      return result;
    },
    [profile, onProfileChange],
  );

  const updateSkillLastUsed = useCallback(
    (id: string, value: string) => {
      const nextLast = value.trim() === '' ? null : value;
      const nextSkills = profile.skills.map((s) =>
        s.id === id ? { ...s, lastUsed: nextLast } : s,
      );
      const next: CandidateProfileV1 = { ...profile, skills: nextSkills };
      const result = onProfileChange(next);
      if (result && typeof (result as Promise<void>).then === 'function') {
        void (result as Promise<void>).catch(() => {});
      }
      return result;
    },
    [profile, onProfileChange],
  );

  return {
    skills: profile.skills,
    isAddOpen,
    addError,
    openAdd,
    closeAdd,
    handleAdd,
    removeTarget,
    requestRemove,
    cancelRemove,
    confirmRemove,
    handleReorder,
    updateSkillName,
    updateSkillCategory,
    updateSkillYears,
    updateSkillLastUsed,
  };
}
