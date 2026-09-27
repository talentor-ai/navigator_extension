import { describe, it, expect } from 'vitest';
import type { components } from '@talentor/contracts';
import {
  reorder,
  reorderById,
  removeSkill,
  removeExperience,
  removeProject,
  removeEducation,
  removeLanguage,
  removeCertification,
} from './utils';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];

function makeProfile(): CandidateProfileV1 {
  return {
    schemaVersion: 1,
    locale: 'en-US',
    personalInfo: {
      fullName: 'Ada',
      email: 'ada@example.com',
      links: [],
    },
    defaultRole: null,
    baseSummary: null,
    experience: [
      {
        id: 'exp-1',
        company: 'Acme',
        companyLocation: null,
        position: 'Engineer',
        employmentType: null,
        locationType: null,
        startDate: '2020-01',
        endDate: null,
        summary: null,
        responsibilities: null,
        achievements: [],
        skillRefs: ['skill-1', 'skill-2'],
      },
      {
        id: 'exp-2',
        company: 'Beta',
        companyLocation: null,
        position: 'Senior',
        employmentType: null,
        locationType: null,
        startDate: '2021-01',
        endDate: null,
        summary: null,
        responsibilities: null,
        achievements: [],
        skillRefs: ['skill-2'],
      },
    ],
    skills: [
      {
        id: 'skill-1',
        name: 'React',
        category: 'Frontend',
        aliases: null,
        yearsOfExperience: null,
        lastUsed: null,
        evidenceRefs: ['exp-1', 'proj-1'],
      },
      {
        id: 'skill-2',
        name: 'Node',
        category: 'Backend',
        aliases: null,
        yearsOfExperience: null,
        lastUsed: null,
        evidenceRefs: null,
      },
      {
        id: 'skill-3',
        name: 'TS',
        category: 'Lang',
        aliases: null,
        yearsOfExperience: null,
        lastUsed: null,
        evidenceRefs: ['exp-2', 'proj-2'],
      },
    ],
    languages: [
      { id: 'lang-1', language: 'English', proficiency: 'C1' },
      { id: 'lang-2', language: 'Spanish', proficiency: 'native' },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'Uni A',
        degree: null,
        fieldOfStudy: null,
        location: null,
        startDate: null,
        endDate: null,
      },
      {
        id: 'edu-2',
        institution: 'Uni B',
        degree: null,
        fieldOfStudy: null,
        location: null,
        startDate: null,
        endDate: null,
      },
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'P1',
        role: null,
        description: 'desc',
        startDate: null,
        endDate: null,
        url: null,
        repository: null,
        achievements: null,
        skillRefs: ['skill-1', 'skill-3'],
      },
      {
        id: 'proj-2',
        name: 'P2',
        role: null,
        description: 'desc2',
        startDate: null,
        endDate: null,
        url: null,
        repository: null,
        achievements: null,
        skillRefs: null,
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'Cert A',
        issuer: 'Issuer A',
        issueDate: null,
        expirationDate: null,
        credentialId: null,
        credentialUrl: null,
      },
      {
        id: 'cert-2',
        name: 'Cert B',
        issuer: 'Issuer B',
        issueDate: null,
        expirationDate: null,
        credentialId: null,
        credentialUrl: null,
      },
    ],
  };
}

describe('reorder', () => {
  it('reorders items', () => {
    expect(reorder(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
    expect(reorder(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b']);
  });

  it('no-op when same index', () => {
    const arr = ['a', 'b'];
    expect(reorder(arr, 1, 1)).toBe(arr);
  });

  it('no-op on out of bounds', () => {
    const arr = ['a', 'b'];
    expect(reorder(arr, -1, 1)).toBe(arr);
    expect(reorder(arr, 0, 5)).toBe(arr);
    expect(reorder(arr, 5, 0)).toBe(arr);
  });

  it('does not mutate original', () => {
    const arr = ['a', 'b', 'c'];
    const copy = [...arr];
    reorder(arr, 0, 1);
    expect(arr).toEqual(copy);
  });

  it('handles empty array', () => {
    expect(reorder([], 0, 0)).toEqual([]);
  });

  it('reorderById no-op when same id', () => {
    const items = [{ id: 'a' }, { id: 'b' }];
    expect(reorderById(items, (x) => x.id, 'a', 'a')).toBe(items);
  });

  it('reorderById handles missing id', () => {
    const items = [{ id: 'a' }, { id: 'b' }];
    expect(reorderById(items, (x) => x.id, 'a', 'missing')).toBe(items);
    expect(reorderById(items, (x) => x.id, 'missing', 'a')).toBe(items);
  });

  it('reorderById reorders correctly', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    expect(reorderById(items, (x) => x.id, 'a', 'c')).toEqual([
      { id: 'b' },
      { id: 'c' },
      { id: 'a' },
    ]);
  });
});

describe('cascade removal helpers', () => {
  it('removeSkill filters experience and project skillRefs, preserves null', () => {
    const p = makeProfile();
    const next = removeSkill(p, 'skill-1');
    expect(next.skills.map((s) => s.id)).toEqual(['skill-2', 'skill-3']);
    expect(next.experience[0].skillRefs).toEqual(['skill-2']);
    expect(next.experience[1].skillRefs).toEqual(['skill-2']);
    expect(next.projects[0].skillRefs).toEqual(['skill-3']);
    expect(next.projects[1].skillRefs).toBeNull();
    // original not mutated
    expect(p.skills.length).toBe(3);
    expect(p.projects[1].skillRefs).toBeNull();
  });

  it('removeSkill no-op when id missing', () => {
    const p = makeProfile();
    expect(removeSkill(p, 'missing')).toBe(p);
  });

  it('removeExperience filters skill evidenceRefs and preserves null', () => {
    const p = makeProfile();
    const next = removeExperience(p, 'exp-1');
    expect(next.experience.map((e) => e.id)).toEqual(['exp-2']);
    expect(next.skills[0].evidenceRefs).toEqual(['proj-1']);
    expect(next.skills[1].evidenceRefs).toBeNull();
    expect(next.skills[2].evidenceRefs).toEqual(['exp-2', 'proj-2']);
    expect(p.experience.length).toBe(2);
  });

  it('removeExperience no-op when missing', () => {
    const p = makeProfile();
    expect(removeExperience(p, 'missing')).toBe(p);
  });

  it('removeProject filters skill evidenceRefs and preserves null', () => {
    const p = makeProfile();
    const next = removeProject(p, 'proj-1');
    expect(next.projects.map((proj) => proj.id)).toEqual(['proj-2']);
    expect(next.skills[0].evidenceRefs).toEqual(['exp-1']);
    expect(next.skills[1].evidenceRefs).toBeNull();
  });

  it('removeProject preserves null skillRefs and no-op missing', () => {
    const p = makeProfile();
    expect(removeProject(p, 'missing')).toBe(p);
    const next = removeProject(p, 'proj-2');
    expect(next.projects[1]).toBeUndefined();
    expect(next.projects[0].skillRefs).toEqual(['skill-1', 'skill-3']);
  });

  it('removeEducation simple removal', () => {
    const p = makeProfile();
    const next = removeEducation(p, 'edu-1');
    expect(next.education.map((e) => e.id)).toEqual(['edu-2']);
    expect(p.education.length).toBe(2);
  });

  it('removeEducation no-op', () => {
    const p = makeProfile();
    expect(removeEducation(p, 'missing')).toBe(p);
  });

  it('removeLanguage simple removal', () => {
    const p = makeProfile();
    const next = removeLanguage(p, 'lang-1');
    expect(next.languages.map((l) => l.id)).toEqual(['lang-2']);
  });

  it('removeLanguage no-op', () => {
    const p = makeProfile();
    expect(removeLanguage(p, 'nope')).toBe(p);
  });

  it('removeCertification simple removal', () => {
    const p = makeProfile();
    const next = removeCertification(p, 'cert-1');
    expect(next.certifications.map((c) => c.id)).toEqual(['cert-2']);
  });

  it('removeCertification no-op', () => {
    const p = makeProfile();
    expect(removeCertification(p, 'nope')).toBe(p);
  });

  it('cascade helpers preserve referential equality where unchanged', () => {
    const p = makeProfile();
    const next = removeEducation(p, 'edu-1');
    expect(next.skills).toBe(p.skills);
    expect(next.experience).toBe(p.experience);
  });
});
