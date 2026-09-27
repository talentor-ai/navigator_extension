import { useCallback, useState } from 'react';
import type { components } from '@talentor/contracts';
import { removeEducation, reorder } from '../../../collections';
import type { CandidateProfileV1 } from '../types';

export function useEducationSection(
  profile: CandidateProfileV1,
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>,
) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  const updateInstitution = useCallback(
    (id: string, value: string) => {
      const nextEducation = profile.education.map((e) =>
        e.id === id ? { ...e, institution: value } : e,
      );
      const next: CandidateProfileV1 = { ...profile, education: nextEducation };
      return onProfileChange(next);
    },
    [profile, onProfileChange],
  );

  const updateDegree = useCallback(
    (id: string, value: string) => {
      const nextDegree = value.trim() === '' ? null : value;
      const nextEducation = profile.education.map((e) =>
        e.id === id ? { ...e, degree: nextDegree } : e,
      );
      const next: CandidateProfileV1 = { ...profile, education: nextEducation };
      return onProfileChange(next);
    },
    [profile, onProfileChange],
  );

  const updateFieldOfStudy = useCallback(
    (id: string, value: string) => {
      const nextField = value.trim() === '' ? null : value;
      const nextEducation = profile.education.map((e) =>
        e.id === id ? { ...e, fieldOfStudy: nextField } : e,
      );
      const next: CandidateProfileV1 = { ...profile, education: nextEducation };
      return onProfileChange(next);
    },
    [profile, onProfileChange],
  );

  const updateCity = useCallback(
    (id: string, value: string) => {
      const nextCity = value.trim() === '' ? null : value;
      const nextEducation = profile.education.map((e) => {
        if (e.id !== id) return e;
        const baseLoc = e.location ?? {};
        const nextLoc = {
          ...baseLoc,
          city: nextCity,
        } as components['schemas']['Location'];
        return { ...e, location: nextLoc };
      });
      const next: CandidateProfileV1 = { ...profile, education: nextEducation };
      return onProfileChange(next);
    },
    [profile, onProfileChange],
  );

  const updateRegion = useCallback(
    (id: string, value: string) => {
      const nextRegion = value.trim() === '' ? null : value;
      const nextEducation = profile.education.map((e) => {
        if (e.id !== id) return e;
        const baseLoc = e.location ?? {};
        const nextLoc = {
          ...baseLoc,
          region: nextRegion,
        } as components['schemas']['Location'];
        return { ...e, location: nextLoc };
      });
      const next: CandidateProfileV1 = { ...profile, education: nextEducation };
      return onProfileChange(next);
    },
    [profile, onProfileChange],
  );

  const updateCountryCode = useCallback(
    (id: string, value: string) => {
      const nextCountry = value.trim() === '' ? null : value;
      const nextEducation = profile.education.map((e) => {
        if (e.id !== id) return e;
        const baseLoc = e.location ?? {};
        const nextLoc = {
          ...baseLoc,
          countryCode: nextCountry,
        } as components['schemas']['Location'];
        return { ...e, location: nextLoc };
      });
      const next: CandidateProfileV1 = { ...profile, education: nextEducation };
      return onProfileChange(next);
    },
    [profile, onProfileChange],
  );

  const updateStartDate = useCallback(
    (id: string, value: string) => {
      const nextStart = value.trim() === '' ? null : value;
      const nextEducation = profile.education.map((e) =>
        e.id === id ? { ...e, startDate: nextStart } : e,
      );
      const next: CandidateProfileV1 = { ...profile, education: nextEducation };
      return onProfileChange(next);
    },
    [profile, onProfileChange],
  );

  const updateEndDate = useCallback(
    (id: string, value: string) => {
      const nextEnd = value.trim() === '' ? null : value;
      const nextEducation = profile.education.map((e) =>
        e.id === id ? { ...e, endDate: nextEnd } : e,
      );
      const next: CandidateProfileV1 = { ...profile, education: nextEducation };
      return onProfileChange(next);
    },
    [profile, onProfileChange],
  );

  const openAdd = useCallback(() => {
    setAddError(null);
    setIsAddOpen(true);
  }, []);

  const closeAdd = useCallback(() => {
    setIsAddOpen(false);
    setAddError(null);
  }, []);

  const handleAdd = useCallback(
    (institution: string) => {
      const trimmed = institution.trim();
      if (!trimmed) {
        setAddError('Institution is required');
        return;
      }
      const newEducation = {
        id: crypto.randomUUID(),
        institution: trimmed,
      };
      const next: CandidateProfileV1 = {
        ...profile,
        education: [...profile.education, newEducation],
      };
      const result = onProfileChange(next);
      if (result && typeof (result as Promise<void>).then === 'function') {
        void (result as Promise<void>)
          .then(() => {
            setIsAddOpen(false);
            setAddError(null);
          })
          .catch(() => {
            // keep dialog open on failure
          });
        return result as unknown as void;
      }
      setIsAddOpen(false);
      setAddError(null);
    },
    [profile, onProfileChange],
  );

  const requestRemove = useCallback((id: string) => {
    setRemoveTarget(id);
  }, []);

  const cancelRemove = useCallback(() => {
    setRemoveTarget(null);
  }, []);

  const confirmRemove = useCallback(() => {
    if (!removeTarget) return;
    const next = removeEducation(profile, removeTarget);
    if (next === profile) {
      setRemoveTarget(null);
      return;
    }
    const result = onProfileChange(next);
    if (result && typeof (result as Promise<void>).then === 'function') {
      void (result as Promise<void>)
        .then(() => setRemoveTarget(null))
        .catch(() => {
          // keep dialog open on failure
        });
      return result as unknown as void;
    }
    setRemoveTarget(null);
  }, [profile, onProfileChange, removeTarget]);

  const handleReorder = useCallback(
    (oldIndex: number, newIndex: number) => {
      const nextEducation = reorder(profile.education, oldIndex, newIndex);
      if (nextEducation === profile.education) return;
      const next: CandidateProfileV1 = {
        ...profile,
        education: nextEducation,
      };
      const result = onProfileChange(next);
      if (result && typeof (result as Promise<void>).then === 'function') {
        void (result as Promise<void>).catch(() => {});
      }
      return result as unknown as void;
    },
    [profile, onProfileChange],
  );

  return {
    education: profile.education,
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
    updateInstitution,
    updateDegree,
    updateFieldOfStudy,
    updateCity,
    updateRegion,
    updateCountryCode,
    updateStartDate,
    updateEndDate,
  };
}
