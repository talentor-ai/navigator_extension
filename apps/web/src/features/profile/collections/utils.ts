import type { components } from '@talentor/contracts';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];

/**
 * Pure reorder helper. Returns new array, never mutates input.
 * No-op when indices equal, out of bounds, or list empty.
 */
export function reorder<T>(
  items: T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  if (fromIndex === toIndex) return items;
  if (fromIndex < 0 || fromIndex >= items.length) return items;
  if (toIndex < 0 || toIndex >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

/**
 * Generic move by id. Convenience for reorder via ids.
 * Returns original array reference on no-op for referential stability checks where practical.
 */
export function reorderById<T>(
  items: T[],
  getId: (item: T) => string,
  activeId: string,
  overId: string,
): T[] {
  if (activeId === overId) return items;
  const oldIndex = items.findIndex((item) => getId(item) === activeId);
  const newIndex = items.findIndex((item) => getId(item) === overId);
  if (oldIndex === -1 || newIndex === -1) return items;
  return reorder(items, oldIndex, newIndex);
}

function filterSkillRefs(
  skillRefs: string[] | null | undefined,
  skillId: string,
): string[] | null {
  if (skillRefs == null) return skillRefs as null;
  if (!skillRefs.includes(skillId)) return skillRefs;
  return skillRefs.filter((id) => id !== skillId);
}

function filterEvidenceRefs(
  evidenceRefs: string[] | null | undefined,
  targetId: string,
): string[] | null | undefined {
  if (evidenceRefs == null) return evidenceRefs;
  if (!evidenceRefs.includes(targetId)) return evidenceRefs;
  return evidenceRefs.filter((id) => id !== targetId);
}

/** Remove skill + cascade to experience/project skillRefs. Preserves null. */
export function removeSkill(
  profile: CandidateProfileV1,
  skillId: string,
): CandidateProfileV1 {
  const nextSkills = profile.skills.filter((s) => s.id !== skillId);
  if (nextSkills.length === profile.skills.length) return profile;

  const nextExperience = profile.experience.map((exp) => {
    if (!exp.skillRefs.includes(skillId)) return exp;
    return { ...exp, skillRefs: exp.skillRefs.filter((id) => id !== skillId) };
  });

  const nextProjects = profile.projects.map((proj) => {
    const filtered = filterSkillRefs(proj.skillRefs ?? null, skillId);
    if (filtered === proj.skillRefs) return proj;
    return { ...proj, skillRefs: filtered };
  });

  return {
    ...profile,
    skills: nextSkills,
    experience: nextExperience,
    projects: nextProjects,
  };
}

/** Remove experience + filter every skill evidenceRefs. Preserves null. */
export function removeExperience(
  profile: CandidateProfileV1,
  experienceId: string,
): CandidateProfileV1 {
  const nextExperience = profile.experience.filter(
    (e) => e.id !== experienceId,
  );
  if (nextExperience.length === profile.experience.length) return profile;

  const nextSkills = profile.skills.map((skill) => {
    const filtered = filterEvidenceRefs(skill.evidenceRefs, experienceId);
    if (filtered === skill.evidenceRefs) return skill;
    return { ...skill, evidenceRefs: filtered as string[] | null };
  });

  return { ...profile, experience: nextExperience, skills: nextSkills };
}

/** Remove project + filter every skill evidenceRefs. Preserves null. */
export function removeProject(
  profile: CandidateProfileV1,
  projectId: string,
): CandidateProfileV1 {
  const nextProjects = profile.projects.filter((p) => p.id !== projectId);
  if (nextProjects.length === profile.projects.length) return profile;

  const nextSkills = profile.skills.map((skill) => {
    const filtered = filterEvidenceRefs(skill.evidenceRefs, projectId);
    if (filtered === skill.evidenceRefs) return skill;
    return { ...skill, evidenceRefs: filtered as string[] | null };
  });

  return { ...profile, projects: nextProjects, skills: nextSkills };
}

export function removeEducation(
  profile: CandidateProfileV1,
  educationId: string,
): CandidateProfileV1 {
  const next = profile.education.filter((e) => e.id !== educationId);
  if (next.length === profile.education.length) return profile;
  return { ...profile, education: next };
}

export function removeLanguage(
  profile: CandidateProfileV1,
  languageId: string,
): CandidateProfileV1 {
  const next = profile.languages.filter((l) => l.id !== languageId);
  if (next.length === profile.languages.length) return profile;
  return { ...profile, languages: next };
}

export function removeCertification(
  profile: CandidateProfileV1,
  certificationId: string,
): CandidateProfileV1 {
  const next = profile.certifications.filter((c) => c.id !== certificationId);
  if (next.length === profile.certifications.length) return profile;
  return { ...profile, certifications: next };
}
