import { useState } from 'react';
import type { components } from '@talentor/contracts';
import { removeProject, reorder } from '@/features/profile/collections';
import type { CandidateProfileV1 } from '../types';

type ProjectDraft = {
  name: string;
  description: string;
};

type ProjectAddErrors = Partial<Record<keyof ProjectDraft, string>>;

const INITIAL_DRAFT: ProjectDraft = {
  name: '',
  description: '',
};

export function useProjectEditor(
  profile: CandidateProfileV1,
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>,
) {
  const updateName = (id: string, value: string) => {
    const nextProjects = profile.projects.map((p) =>
      p.id === id ? { ...p, name: value } : p,
    );
    const next: CandidateProfileV1 = { ...profile, projects: nextProjects };
    return onProfileChange(next);
  };

  const updateRole = (id: string, value: string) => {
    const nextRole = value.trim() === '' ? null : value;
    const nextProjects = profile.projects.map((p) =>
      p.id === id ? { ...p, role: nextRole } : p,
    );
    const next: CandidateProfileV1 = { ...profile, projects: nextProjects };
    return onProfileChange(next);
  };

  const updateDescription = (id: string, value: string) => {
    const nextProjects = profile.projects.map((p) =>
      p.id === id ? { ...p, description: value } : p,
    );
    const next: CandidateProfileV1 = { ...profile, projects: nextProjects };
    return onProfileChange(next);
  };

  const updateStartDate = (id: string, value: string) => {
    const nextStart = value.trim() === '' ? null : value;
    const nextProjects = profile.projects.map((p) =>
      p.id === id ? { ...p, startDate: nextStart } : p,
    );
    const next: CandidateProfileV1 = { ...profile, projects: nextProjects };
    return onProfileChange(next);
  };

  const updateEndDate = (id: string, value: string) => {
    const nextEnd = value.trim() === '' ? null : value;
    const nextProjects = profile.projects.map((p) =>
      p.id === id ? { ...p, endDate: nextEnd } : p,
    );
    const next: CandidateProfileV1 = { ...profile, projects: nextProjects };
    return onProfileChange(next);
  };

  const updateUrl = (id: string, value: string) => {
    const nextUrl = value.trim() === '' ? null : value;
    const nextProjects = profile.projects.map((p) =>
      p.id === id ? { ...p, url: nextUrl } : p,
    );
    const next: CandidateProfileV1 = { ...profile, projects: nextProjects };
    return onProfileChange(next);
  };

  const updateRepository = (id: string, value: string) => {
    const nextRepo = value.trim() === '' ? null : value;
    const nextProjects = profile.projects.map((p) =>
      p.id === id ? { ...p, repository: nextRepo } : p,
    );
    const next: CandidateProfileV1 = { ...profile, projects: nextProjects };
    return onProfileChange(next);
  };

  const updateAchievement = (id: string, index: number, value: string) => {
    const nextProjects = profile.projects.map((p) => {
      if (p.id !== id) return p;
      const prev = p.achievements ?? [];
      const nextAch = prev.map((a, i) => (i === index ? value : a));
      return { ...p, achievements: nextAch };
    });
    const next: CandidateProfileV1 = { ...profile, projects: nextProjects };
    return onProfileChange(next);
  };

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [draft, setDraft] = useState<ProjectDraft>({ ...INITIAL_DRAFT });
  const [addErrors, setAddErrors] = useState<ProjectAddErrors>({});
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

  const handleDraftChange = (field: keyof ProjectDraft, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (addErrors[field]) {
      setAddErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddConfirm = () => {
    const name = draft.name.trim();
    const description = draft.description.trim();
    const errors: ProjectAddErrors = {};
    if (!name) errors.name = 'Name is required';
    if (!description) errors.description = 'Description is required';
    if (Object.keys(errors).length > 0) {
      setAddErrors(errors);
      return;
    }
    const newProject = {
      id: crypto.randomUUID(),
      name,
      description,
    } as components['schemas']['Project'];
    const next: CandidateProfileV1 = {
      ...profile,
      projects: [...profile.projects, newProject],
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
          // keep dialog open on failure
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
    const next = removeProject(profile, pendingRemoveId);
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
    const nextProjects = reorder(profile.projects, oldIndex, newIndex);
    if (nextProjects === profile.projects) return;
    const next: CandidateProfileV1 = { ...profile, projects: nextProjects };
    const result = onProfileChange(next);
    if (result && typeof (result as Promise<void>).then === 'function') {
      void (result as Promise<void>).catch(() => {
        // attach rejection handling without swallowing parent query error state
      });
    }
    return result as unknown as void;
  };

  return {
    updateName,
    updateRole,
    updateDescription,
    updateStartDate,
    updateEndDate,
    updateUrl,
    updateRepository,
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
