import { describe, it, expect } from 'vitest';
import type { components } from '@talentor/contracts';
import { MAX_FILE_SIZE } from './constants';
import {
  getFileExtension,
  validateDraftProfile,
  validateProfileName,
  validateResumeFile,
} from './validation';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];

function makeFile(name: string, size: number, type = 'application/pdf'): File {
  const buffer = new Uint8Array(size);
  return new File([buffer], name, { type });
}

function makeProfile(
  overrides?: Partial<CandidateProfileV1>,
): CandidateProfileV1 {
  const base: CandidateProfileV1 = {
    schemaVersion: 1,
    locale: 'en-US',
    personalInfo: {
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      links: [],
    },
    defaultRole: null,
    baseSummary: null,
    experience: [],
    skills: [],
    languages: [],
    education: [],
    projects: [],
    certifications: [],
  } as unknown as CandidateProfileV1;
  return {
    ...base,
    ...overrides,
    personalInfo: {
      ...base.personalInfo,
      ...(overrides?.personalInfo ?? {}),
    },
  } as CandidateProfileV1;
}

describe('getFileExtension', () => {
  it('lowercases extension', () => {
    expect(getFileExtension('resume.PDF')).toBe('.pdf');
    expect(getFileExtension('file.DocX')).toBe('.docx');
  });
});

describe('validateResumeFile', () => {
  it('accepts pdf/doc/docx case-insensitive', () => {
    expect(validateResumeFile(makeFile('resume.pdf', 1000))).toBeNull();
    expect(validateResumeFile(makeFile('resume.PDF', 1000))).toBeNull();
    expect(validateResumeFile(makeFile('resume.doc', 1000))).toBeNull();
    expect(validateResumeFile(makeFile('resume.DOC', 1000))).toBeNull();
    expect(validateResumeFile(makeFile('resume.docx', 1000))).toBeNull();
    expect(validateResumeFile(makeFile('resume.DOCX', 1000))).toBeNull();
  });

  it('rejects unsupported extensions', () => {
    expect(validateResumeFile(makeFile('resume.txt', 1000))).not.toBeNull();
    expect(validateResumeFile(makeFile('resume.png', 1000))).not.toBeNull();
    expect(validateResumeFile(makeFile('resume', 1000))).not.toBeNull();
    expect(validateResumeFile(makeFile('resume.pdf.exe', 1000))).not.toBeNull();
  });

  it('rejects zero-byte file', () => {
    expect(validateResumeFile(makeFile('resume.pdf', 0))).not.toBeNull();
    expect(validateResumeFile(makeFile('resume.pdf', 0))).toMatch(/empty/i);
  });

  it('rejects oversize >5 MiB', () => {
    const oversize = MAX_FILE_SIZE + 1;
    const err = validateResumeFile(makeFile('resume.pdf', oversize));
    expect(err).not.toBeNull();
    expect(err).toMatch(/large|size|5 MiB/i);
  });

  it('accepts exactly 5 MiB', () => {
    expect(
      validateResumeFile(makeFile('resume.pdf', MAX_FILE_SIZE)),
    ).toBeNull();
  });

  it('rejects unsupported type message contains unsupported', () => {
    const err = validateResumeFile(makeFile('resume.txt', 100));
    expect(err).toMatch(/unsupported/i);
  });
});

describe('validateProfileName', () => {
  it('accepts trimmed valid name', () => {
    expect(validateProfileName(' Backend ')).toBeNull();
    expect(validateProfileName('a')).toBeNull();
    expect(validateProfileName('  a  ')).toBeNull();
  });

  it('rejects blank', () => {
    expect(validateProfileName('')).not.toBeNull();
    expect(validateProfileName('   ')).not.toBeNull();
    expect(validateProfileName('   ')).toMatch(/required/i);
  });

  it('trims before length check', () => {
    const name120 = 'a'.repeat(120);
    expect(validateProfileName(name120)).toBeNull();
    expect(validateProfileName(`  ${name120}  `)).toBeNull();
  });

  it('rejects over 120 chars', () => {
    const name121 = 'a'.repeat(121);
    expect(validateProfileName(name121)).not.toBeNull();
    expect(validateProfileName(name121)).toMatch(/120/i);
    expect(validateProfileName(`  ${name121}  `)).not.toBeNull();
  });
});

describe('validateDraftProfile', () => {
  it('accepts valid profile', () => {
    const profile = makeProfile();
    const { fullName, email } = validateDraftProfile(profile);
    expect(fullName).toBeNull();
    expect(email).toBeNull();
  });

  it('requires fullName non-blank', () => {
    const p1 = makeProfile({
      personalInfo: {
        fullName: '',
        email: 'ada@example.com',
        links: [],
      } as any,
    });
    expect(validateDraftProfile(p1).fullName).not.toBeNull();
    expect(validateDraftProfile(p1).fullName).toMatch(/required/i);

    const p2 = makeProfile({
      personalInfo: {
        fullName: '   ',
        email: 'ada@example.com',
        links: [],
      } as any,
    });
    expect(validateDraftProfile(p2).fullName).not.toBeNull();
  });

  it('requires email non-blank and valid', () => {
    const p1 = makeProfile({
      personalInfo: { fullName: 'Ada', email: '', links: [] } as any,
    });
    expect(validateDraftProfile(p1).email).not.toBeNull();
    expect(validateDraftProfile(p1).email).toMatch(/required/i);

    const p2 = makeProfile({
      personalInfo: { fullName: 'Ada', email: '   ', links: [] } as any,
    });
    expect(validateDraftProfile(p2).email).not.toBeNull();

    const p3 = makeProfile({
      personalInfo: { fullName: 'Ada', email: 'notanemail', links: [] } as any,
    });
    expect(validateDraftProfile(p3).email).not.toBeNull();
    expect(validateDraftProfile(p3).email).toMatch(/valid email/i);

    const p4 = makeProfile({
      personalInfo: {
        fullName: 'Ada',
        email: 'valid@example.com',
        links: [],
      } as any,
    });
    expect(validateDraftProfile(p4).email).toBeNull();
  });
});
