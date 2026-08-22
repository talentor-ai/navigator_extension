import { useCallback, useState } from 'react';
import { removeCertification, reorder } from '../../../collections';
import type { CandidateProfileV1 } from '../types';

export function useCertificationsSection(
  profile: CandidateProfileV1,
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>,
) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  const updateName = useCallback(
    (id: string, value: string) => {
      const nextCerts = profile.certifications.map((c) =>
        c.id === id ? { ...c, name: value } : c,
      );
      const next: CandidateProfileV1 = {
        ...profile,
        certifications: nextCerts,
      };
      return onProfileChange(next);
    },
    [profile, onProfileChange],
  );

  const updateIssuer = useCallback(
    (id: string, value: string) => {
      const nextCerts = profile.certifications.map((c) =>
        c.id === id ? { ...c, issuer: value } : c,
      );
      const next: CandidateProfileV1 = {
        ...profile,
        certifications: nextCerts,
      };
      return onProfileChange(next);
    },
    [profile, onProfileChange],
  );

  const updateIssueDate = useCallback(
    (id: string, value: string) => {
      const nextDate = value.trim() === '' ? null : value;
      const nextCerts = profile.certifications.map((c) =>
        c.id === id ? { ...c, issueDate: nextDate } : c,
      );
      const next: CandidateProfileV1 = {
        ...profile,
        certifications: nextCerts,
      };
      return onProfileChange(next);
    },
    [profile, onProfileChange],
  );

  const updateExpirationDate = useCallback(
    (id: string, value: string) => {
      const nextDate = value.trim() === '' ? null : value;
      const nextCerts = profile.certifications.map((c) =>
        c.id === id ? { ...c, expirationDate: nextDate } : c,
      );
      const next: CandidateProfileV1 = {
        ...profile,
        certifications: nextCerts,
      };
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
    (name: string, issuer: string) => {
      const trimmedName = name.trim();
      const trimmedIssuer = issuer.trim();
      if (!trimmedName || !trimmedIssuer) {
        setAddError('Name and issuer are required');
        return;
      }
      const newCert = {
        id: crypto.randomUUID(),
        name: trimmedName,
        issuer: trimmedIssuer,
      };
      const next: CandidateProfileV1 = {
        ...profile,
        certifications: [...profile.certifications, newCert],
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
    const next = removeCertification(profile, removeTarget);
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
      const nextCerts = reorder(profile.certifications, oldIndex, newIndex);
      if (nextCerts === profile.certifications) return;
      const next: CandidateProfileV1 = {
        ...profile,
        certifications: nextCerts,
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
    certifications: profile.certifications,
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
    updateName,
    updateIssuer,
    updateIssueDate,
    updateExpirationDate,
  };
}
