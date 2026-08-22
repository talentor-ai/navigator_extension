import { useCallback, useState } from 'react';
import { removeLanguage, reorder } from '../../../collections';
import type { CandidateProfileV1, LanguageProficiency } from '../types';

export function useLanguagesSection(
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
    async (language: string, proficiency: string) => {
      const trimmedLanguage = language.trim();
      const trimmedProficiency = proficiency.trim();
      if (!trimmedLanguage || !trimmedProficiency) {
        setAddError('Language and proficiency are required');
        return;
      }
      const newLanguage = {
        id: crypto.randomUUID(),
        language: trimmedLanguage,
        proficiency: trimmedProficiency as LanguageProficiency,
      };
      const next: CandidateProfileV1 = {
        ...profile,
        languages: [...profile.languages, newLanguage],
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
    const next = removeLanguage(profile, removeTarget);
    if (next !== profile) {
      try {
        await onProfileChange(next);
        setRemoveTarget(null);
      } catch {
        // keep open on rejection
      }
      return;
    }
    setRemoveTarget(null);
  }, [profile, onProfileChange, removeTarget]);

  const handleReorder = useCallback(
    (oldIndex: number, newIndex: number) => {
      const nextLanguages = reorder(profile.languages, oldIndex, newIndex);
      if (nextLanguages === profile.languages) return;
      const next: CandidateProfileV1 = {
        ...profile,
        languages: nextLanguages,
      };
      const result = onProfileChange(next);
      if (result && typeof (result as Promise<void>).then === 'function') {
        void (result as Promise<void>).catch(() => {});
      }
    },
    [profile, onProfileChange],
  );

  const updateLanguage = useCallback(
    (id: string, value: string) => {
      const nextLanguages = profile.languages.map((l) =>
        l.id === id ? { ...l, language: value } : l,
      );
      const next: CandidateProfileV1 = {
        ...profile,
        languages: nextLanguages,
      };
      const result = onProfileChange(next);
      if (result && typeof (result as Promise<void>).then === 'function') {
        void (result as Promise<void>).catch(() => {});
      }
      return result;
    },
    [profile, onProfileChange],
  );

  const updateProficiency = useCallback(
    (id: string, value: string) => {
      const nextLanguages = profile.languages.map((l) =>
        l.id === id
          ? {
              ...l,
              proficiency: value as LanguageProficiency,
            }
          : l,
      );
      const next: CandidateProfileV1 = {
        ...profile,
        languages: nextLanguages,
      };
      const result = onProfileChange(next);
      if (result && typeof (result as Promise<void>).then === 'function') {
        void (result as Promise<void>).catch(() => {});
      }
      return result;
    },
    [profile, onProfileChange],
  );

  return {
    languages: profile.languages,
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
    updateLanguage,
    updateProficiency,
  };
}
