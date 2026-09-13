import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { components } from '@talentor/contracts';

vi.mock('@/components/ui/select', () => {
  let currentOnValueChange: ((v: string) => void) | undefined;
  return {
    Select: ({
      children,
      onValueChange,
      value,
      defaultValue,
      disabled,
    }: {
      children: React.ReactNode;
      onValueChange?: (v: string) => void;
      value?: string;
      defaultValue?: string;
      disabled?: boolean;
    }) => {
      currentOnValueChange = onValueChange;
      return (
        <div
          data-testid="select-root"
          data-value={value ?? ''}
          data-default-value={defaultValue ?? ''}
          data-disabled={disabled ? 'true' : undefined}
        >
          {children}
        </div>
      );
    },
    SelectTrigger: ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      children?: React.ReactNode;
    }) => <button {...props}>{children}</button>,
    SelectContent: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    SelectItem: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value: string;
    }) => (
      <div role="option" onClick={() => currentOnValueChange?.(value)}>
        {children}
      </div>
    ),
    SelectValue: () => <span />,
    SelectGroup: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    SelectLabel: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    SelectSeparator: () => <div />,
    SelectScrollUpButton: () => <div />,
    SelectScrollDownButton: () => <div />,
  };
});

import ProfileHeader from './components/ProfileHeader';
import ContactDetails from './components/ContactDetails';
import SummarySection from './sections/SummarySection';
import ExperienceSection from './sections/ExperienceSection';
import SkillsSection from './sections/SkillsSection';
import LanguagesSection from './sections/LanguagesSection';
import EducationSection from './sections/EducationSection';
import ProjectsSection from './sections/ProjectsSection';
import CertificationsSection from './sections/CertificationsSection';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];

beforeAll(() => {
  const g = globalThis as unknown as Record<string, unknown>;
  if (!g.ResizeObserver) {
    g.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  const w = window as unknown as Record<string, unknown>;
  if (!w.ResizeObserver) {
    w.ResizeObserver = g.ResizeObserver;
  }
  const proto = HTMLElement.prototype as unknown as Record<string, unknown>;
  if (!proto.hasPointerCapture) proto.hasPointerCapture = vi.fn(() => false);
  if (!proto.setPointerCapture) proto.setPointerCapture = vi.fn();
  if (!proto.releasePointerCapture) proto.releasePointerCapture = vi.fn();
  if (!proto.scrollIntoView) proto.scrollIntoView = vi.fn();
  if (!window.getComputedStyle) {
    window.getComputedStyle =
      (() => ({})) as unknown as typeof window.getComputedStyle;
  }
});

function makeProfile(
  overrides?: Partial<CandidateProfileV1>,
): CandidateProfileV1 {
  const base: CandidateProfileV1 = {
    schemaVersion: 1,
    locale: 'en-US',
    personalInfo: {
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      phone: '+34 600 000 000',
      location: {
        city: 'Madrid',
        region: 'Madrid',
        countryCode: 'ES',
        timezone: 'Europe/Madrid',
      },
      links: [
        { type: 'github', url: 'https://github.com/ada', label: 'GitHub' },
        { type: 'portfolio', url: 'https://ada.dev', label: 'Portfolio' },
      ],
    },
    defaultRole: 'Engineer',
    baseSummary: 'old summary',
    experience: [
      {
        id: '10000000-0000-4000-a000-000000000001',
        company: 'OldCo',
        companyLocation: null,
        position: 'Developer',
        employmentType: 'full-time',
        locationType: 'remote',
        startDate: '2020-01',
        endDate: null,
        summary: 'exp summary',
        responsibilities: ['resp one', 'resp two'],
        achievements: ['ach one'],
        skillRefs: ['a1b2c3d4-e5f6-4a7b-8c9d-111111111111'],
      },
    ],
    skills: [
      {
        id: 'a1b2c3d4-e5f6-4a7b-8c9d-111111111111',
        name: 'React',
        category: 'Frontend',
        yearsOfExperience: 5,
        lastUsed: '2024-01',
        aliases: ['React.js'],
        evidenceRefs: null,
      },
    ],
    languages: [
      {
        id: '30000000-0000-4000-a000-000000000003',
        language: 'English',
        proficiency: 'C1',
      },
    ],
    education: [
      {
        id: '50000000-0000-4000-a000-000000000005',
        institution: 'Uni',
        degree: 'BSc',
        fieldOfStudy: 'CS',
        location: {
          city: 'Madrid',
          region: 'Madrid',
          countryCode: 'ES',
          timezone: 'Europe/Madrid',
        },
        startDate: '2018-01',
        endDate: '2022-01',
      },
    ],
    projects: [
      {
        id: '60000000-0000-4000-a000-000000000006',
        name: 'Proj',
        role: 'Lead',
        description: 'Desc',
        startDate: '2021-01',
        endDate: null,
        url: 'https://example.com',
        repository: 'https://github.com/repo',
        achievements: ['proj ach'],
        skillRefs: null,
      },
    ],
    certifications: [
      {
        id: '80000000-0000-4000-a000-000000000008',
        name: 'Cert',
        issuer: 'Issuer',
        issueDate: '2020-01',
        expirationDate: null,
        credentialId: 'CRED-123',
        credentialUrl: 'https://cred.example',
      },
    ],
  } as CandidateProfileV1;
  return {
    ...base,
    ...overrides,
    personalInfo: { ...base.personalInfo, ...(overrides?.personalInfo ?? {}) },
  } as CandidateProfileV1;
}

describe('profile editing - immutable saves', () => {
  it('SummarySection baseSummary edits to new immutable profile and null on clear', async () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <SummarySection profile={profile} onProfileChange={onProfileChange} />,
    );
    // edit to new value
    await user.dblClick(screen.getByLabelText('Edit Summary'));
    const input = screen.getByLabelText('Summary');
    await user.clear(input);
    await user.type(input, 'new summary');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onProfileChange).toHaveBeenCalledTimes(1));
    const next = onProfileChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.baseSummary).toBe('new summary');
    expect(next).not.toBe(profile);
    expect(profile.baseSummary).toBe('old summary'); // original preserved
    // cleared -> null
    onProfileChange.mockClear();
    rerender(
      <SummarySection profile={profile} onProfileChange={onProfileChange} />,
    );
    await user.dblClick(screen.getByLabelText('Edit Summary'));
    const input2 = screen.getByLabelText('Summary');
    await user.clear(input2);
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onProfileChange).toHaveBeenCalledTimes(1));
    expect(onProfileChange.mock.calls[0][0].baseSummary).toBeNull();
  });

  it('ContactDetails nested email and location city create minimal location when absent', async () => {
    const user = userEvent.setup();
    const profile = makeProfile({
      personalInfo: {
        fullName: 'Ada',
        email: 'ada@example.com',
        phone: null,
        location: null as unknown as components['schemas']['Location'],
        links: [],
      } as unknown as components['schemas']['PersonalInfo'],
    });
    // email
    const onChange1 = vi.fn();
    render(<ContactDetails profile={profile} onProfileChange={onChange1} />);
    await user.dblClick(screen.getByLabelText('Edit Email'));
    const emailInput = screen.getByLabelText('Email');
    await user.clear(emailInput);
    await user.type(emailInput, 'new@example.com');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange1).toHaveBeenCalled());
    expect(onChange1.mock.calls[0][0].personalInfo.email).toBe(
      'new@example.com',
    );
    expect(profile.personalInfo.email).toBe('ada@example.com');
    // location city minimal creation
    const cityField = screen.getByLabelText('Edit City');
    await user.dblClick(cityField);
    const cityInput = screen.getByLabelText('City');
    await user.clear(cityInput);
    await user.type(cityInput, 'Berlin');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange1).toHaveBeenCalledTimes(2));
    const next2 = onChange1.mock.calls[1][0] as CandidateProfileV1;
    expect(next2.personalInfo.location?.city).toBe('Berlin');
    expect(profile.personalInfo.location).toBeNull();
  });

  it('ProfileHeader defaultRole cleared to null and fullName immutable', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ProfileHeader profile={profile} onProfileChange={onChange} />);
    await user.dblClick(screen.getByLabelText('Edit Default role'));
    const input = screen.getByLabelText('Default role');
    await user.clear(input);
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0][0].defaultRole).toBeNull();
    expect(onChange.mock.calls[0][0].personalInfo).toEqual(
      profile.personalInfo,
    );
    expect(profile.defaultRole).toBe('Engineer');
  });

  it('ExperienceSection nested string array responsibilities by index and immutable', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ExperienceSection profile={profile} onProfileChange={onChange} />);
    const respField = screen.getAllByLabelText('Edit Responsibility')[0];
    await user.dblClick(respField);
    const textarea = screen.getByLabelText('Responsibility');
    await user.clear(textarea);
    await user.type(textarea, 'updated resp');
    // textarea Enter without shift submits
    fireEvent.keyDown(textarea, {
      key: 'Enter',
      code: 'Enter',
      shiftKey: false,
    });
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.experience[0].responsibilities?.[0]).toBe('updated resp');
    expect(next.experience[0].responsibilities?.[1]).toBe('resp two');
    expect(next.experience[0].id).toBe(profile.experience[0].id);
    expect(profile.experience[0].responsibilities?.[0]).toBe('resp one');
    expect(next).not.toBe(profile);
    expect(next.experience).not.toBe(profile.experience);
  });

  it('SkillsSection numeric conversion empty->null and number', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SkillsSection profile={profile} onProfileChange={onChange} />);
    // number to 8
    await user.dblClick(screen.getByLabelText('Edit Years of experience'));
    const input = screen.getByLabelText(
      'Years of experience',
    ) as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '8');
    fireEvent.submit(input.closest('form')!);
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0][0].skills[0].yearsOfExperience).toBe(8);
    expect(typeof onChange.mock.calls[0][0].skills[0].yearsOfExperience).toBe(
      'number',
    );
    // clear -> null
    onChange.mockClear();
    // After submit, component returns to display mode; need to reopen
    // The second display may be stale due to controlled value not updated, so query again
    const displayAgain = screen.getByLabelText('Edit Years of experience');
    await user.dblClick(displayAgain);
    const input2 = screen.getByLabelText(
      'Years of experience',
    ) as HTMLInputElement;
    await user.clear(input2);
    fireEvent.submit(input2.closest('form')!);
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0][0].skills[0].yearsOfExperience).toBeNull();
    expect(profile.skills[0].yearsOfExperience).toBe(5);
  });

  it('SkillsSection invalid and negative years does not call onProfileChange', async () => {
    // number input sanitizes non-numeric to '' (treated as empty->null), so only test representable negatives
    const invalidCases = ['-1', '-0.5', '-10', '-0.001'];
    for (const invalid of invalidCases) {
      const profile = makeProfile();
      const onChange = vi.fn();
      const user = userEvent.setup();
      const { unmount } = render(
        <SkillsSection profile={profile} onProfileChange={onChange} />,
      );
      await user.dblClick(screen.getByLabelText('Edit Years of experience'));
      const input = screen.getByLabelText(
        'Years of experience',
      ) as HTMLInputElement;
      await user.clear(input);
      await user.type(input, invalid);
      fireEvent.submit(input.closest('form')!);
      // allow synchronous submit to settle
      await new Promise((r) => setTimeout(r, 20));
      expect(onChange).not.toHaveBeenCalled();
      unmount();
    }
  });

  it('SkillsSection valid zero and decimal years save as numbers >=0', async () => {
    const cases: Array<{ input: string; expected: number }> = [
      { input: '0', expected: 0 },
      { input: '2.5', expected: 2.5 },
      { input: '0.0', expected: 0 },
      { input: '10.75', expected: 10.75 },
    ];
    for (const { input: val, expected } of cases) {
      const profile = makeProfile();
      const onChange = vi.fn();
      const user = userEvent.setup();
      const { unmount } = render(
        <SkillsSection profile={profile} onProfileChange={onChange} />,
      );
      await user.dblClick(screen.getByLabelText('Edit Years of experience'));
      const input = screen.getByLabelText(
        'Years of experience',
      ) as HTMLInputElement;
      await user.clear(input);
      await user.type(input, val);
      fireEvent.submit(input.closest('form')!);
      await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
      expect(onChange.mock.calls[0][0].skills[0].yearsOfExperience).toBe(
        expected,
      );
      expect(typeof onChange.mock.calls[0][0].skills[0].yearsOfExperience).toBe(
        'number',
      );
      unmount();
    }
  });

  it('SkillsSection empty and whitespace years saves null', async () => {
    const empties = ['', '   '];
    for (const emptyVal of empties) {
      const profile = makeProfile();
      const onChange = vi.fn();
      const user = userEvent.setup();
      const { unmount } = render(
        <SkillsSection profile={profile} onProfileChange={onChange} />,
      );
      await user.dblClick(screen.getByLabelText('Edit Years of experience'));
      const input = screen.getByLabelText(
        'Years of experience',
      ) as HTMLInputElement;
      await user.clear(input);
      if (emptyVal.trim() !== '') {
        await user.type(input, emptyVal);
      } else if (emptyVal === '   ') {
        await user.type(input, '   ');
      }
      fireEvent.submit(input.closest('form')!);
      await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
      expect(onChange.mock.calls[0][0].skills[0].yearsOfExperience).toBeNull();
      unmount();
    }
  });

  it('LanguagesSection enum select retains generated enum strings and preserves id', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<LanguagesSection profile={profile} onProfileChange={onChange} />);
    await user.dblClick(screen.getByLabelText('Edit Proficiency'));
    const trigger = await screen.findByLabelText('Proficiency');
    expect(trigger).toBeInTheDocument();
    const option = await screen.findByText('Native');
    await user.click(option);
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.languages[0].proficiency).toBe('native');
    expect(next.languages[0].id).toBe(profile.languages[0].id);
    expect(next.languages[0].language).toBe(profile.languages[0].language);
  });

  it('Experience enum select employmentType null handling', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ExperienceSection profile={profile} onProfileChange={onChange} />);
    await user.dblClick(screen.getByLabelText('Edit Employment type'));
    await screen.findByLabelText('Employment type');
    const opt = await screen.findByText('Contract');
    await user.click(opt);
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0][0].experience[0].employmentType).toBe(
      'contract',
    );
  });

  it('pending locks editing across sections', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SummarySection profile={profile} onProfileChange={onChange} pending />,
    );
    const display = screen.getByLabelText('Edit Summary');
    expect(display).toHaveAttribute('aria-busy', 'true');
    await user.dblClick(display);
    expect(screen.queryByLabelText('Summary')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('readOnly preview disables all editable fields', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ContactDetails profile={profile} onProfileChange={onChange} readOnly />,
    );
    const emailDisplay = screen.getByLabelText('Edit Email');
    expect(emailDisplay).toHaveAttribute('aria-disabled', 'true');
    await user.dblClick(emailDisplay);
    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();

    // education readOnly also
    render(
      <EducationSection
        profile={profile}
        onProfileChange={onChange}
        readOnly
      />,
    );
    const eduDisplay = screen.getAllByLabelText('Edit Institution')[0];
    expect(eduDisplay).toHaveAttribute('aria-disabled', 'true');
    await user.dblClick(eduDisplay);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('immutable original preservation for nested location edit', async () => {
    const profile = makeProfile();
    const snapshot = JSON.parse(JSON.stringify(profile));
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<EducationSection profile={profile} onProfileChange={onChange} />);
    await user.dblClick(screen.getAllByLabelText('Edit City')[0]);
    const input = screen.getByLabelText('City');
    await user.clear(input);
    await user.type(input, 'Barcelona');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.education[0].location?.city).toBe('Barcelona');
    expect(profile.education[0].location?.city).toBe('Madrid');
    expect(JSON.stringify(profile)).toBe(JSON.stringify(snapshot));
    expect(next.education[0].id).toBe(profile.education[0].id);
  });

  it('empty collections render No ... yet and no Add buttons', () => {
    const empty = makeProfile({
      experience: [],
      skills: [],
      languages: [],
      education: [],
      projects: [],
      certifications: [],
      personalInfo: {
        fullName: 'Ada',
        email: 'a@a.com',
        links: [],
        location: null as unknown as components['schemas']['Location'],
      } as unknown as components['schemas']['PersonalInfo'],
    });
    const noop = vi.fn();
    render(<ExperienceSection profile={empty} onProfileChange={noop} />);
    expect(screen.getByText('No experience yet')).toBeInTheDocument();
    render(<SkillsSection profile={empty} onProfileChange={noop} />);
    expect(screen.getByText('No skills yet')).toBeInTheDocument();
    render(<LanguagesSection profile={empty} onProfileChange={noop} />);
    expect(screen.getByText('No languages yet')).toBeInTheDocument();
    render(<EducationSection profile={empty} onProfileChange={noop} />);
    expect(screen.getByText('No education yet')).toBeInTheDocument();
    render(<ProjectsSection profile={empty} onProfileChange={noop} />);
    expect(screen.getByText('No projects yet')).toBeInTheDocument();
    render(<CertificationsSection profile={empty} onProfileChange={noop} />);
    expect(screen.getByText('No certifications yet')).toBeInTheDocument();
    render(<ContactDetails profile={empty} onProfileChange={noop} />);
    expect(screen.getByText('No links yet')).toBeInTheDocument();
    // Skills and Languages now expose Add via CollectionSectionHeader; other sections remain without Add until their waves
    expect(screen.getAllByRole('button', { name: /Add Skills/i })).toHaveLength(
      1,
    );
    expect(
      screen.getAllByRole('button', { name: /Add Languages/i }),
    ).toHaveLength(1);
  });

  it('forbidden fields not rendered as editable', () => {
    const profile = makeProfile();
    const noop = vi.fn();
    render(<CertificationsSection profile={profile} onProfileChange={noop} />);
    expect(screen.queryByLabelText('Credential ID')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Credential URL')).not.toBeInTheDocument();
    expect(
      screen.getByLabelText('Edit Certification name'),
    ).toBeInTheDocument();
    render(<SkillsSection profile={profile} onProfileChange={noop} />);
    expect(screen.queryByText(/aliases/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/evidence/i)).not.toBeInTheDocument();
    render(<ProfileHeader profile={profile} onProfileChange={noop} />);
    expect(
      screen.queryByLabelText('Edit Profile version'),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Edit Updated at')).not.toBeInTheDocument();
  });

  it('section headings are semantic plain headings not editable fields', () => {
    const profile = makeProfile();
    const noop = vi.fn();
    render(<SummarySection profile={profile} onProfileChange={noop} />);
    expect(
      screen.getByRole('heading', { name: 'Summary' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText('Edit Summary section title'),
    ).not.toBeInTheDocument();

    render(<ExperienceSection profile={profile} onProfileChange={noop} />);
    expect(
      screen.getByRole('heading', { name: 'Experience' }),
    ).toBeInTheDocument();

    render(<ContactDetails profile={profile} onProfileChange={noop} />);
    expect(
      screen.getByRole('heading', { name: 'Contact' }),
    ).toBeInTheDocument();
  });

  it('ProjectsSection achievements add/remove and URL validation', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ProjectsSection profile={profile} onProfileChange={onChange} />);
    // URL invalid should be rejected with validation message
    await user.dblClick(screen.getAllByLabelText('Edit Project URL')[0]);
    const urlInput = screen.getByLabelText('Project URL');
    await user.clear(urlInput);
    await user.type(urlInput, 'ftp://bad.example');
    fireEvent.submit(urlInput.closest('form')!);
    expect(
      await screen.findByText('Enter a valid http(s) URL'),
    ).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
    // valid https URL should submit
    await user.clear(urlInput);
    await user.type(urlInput, 'https://valid.example/projects/1');
    fireEvent.submit(urlInput.closest('form')!);
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const nextUrl = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(nextUrl.projects[0].url).toBe('https://valid.example/projects/1');
    onChange.mockClear();
    // description blank should be rejected
    await user.dblClick(
      screen.getAllByLabelText('Edit Project description')[0],
    );
    const descInput = screen.getByLabelText('Project description');
    await user.clear(descInput);
    fireEvent.keyDown(descInput, {
      key: 'Enter',
      code: 'Enter',
      shiftKey: false,
    });
    expect(
      await screen.findByText('Description is required'),
    ).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
    // add achievement via UI
    const addBtns = screen.getAllByRole('button', { name: 'Add achievement' });
    await user.click(addBtns[0]);
    expect(
      screen.getByRole('dialog', { name: 'Add achievement' }),
    ).toBeInTheDocument();
    const achInput = screen.getByLabelText('Achievement');
    await user.type(achInput, 'new project ach');
    await user.click(screen.getByRole('button', { name: /^Add$/ }));
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const nextAch = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(nextAch.projects[0].achievements).toContain('new project ach');
    onChange.mockClear();
    // remove achievement via UI
    const removeBtn = screen.getAllByLabelText('Remove achievement')[0];
    await user.click(removeBtn);
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const nextRemove = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(nextRemove.projects[0].achievements).toEqual([]);
  });

  it('ContactDetails add link trims, validates URL and nulls blank label with generated id', async () => {
    const empty = makeProfile({
      personalInfo: {
        fullName: 'Ada',
        email: 'a@a.com',
        phone: null,
        links: [],
        location: null as unknown as components['schemas']['Location'],
      } as unknown as components['schemas']['PersonalInfo'],
    });
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { unmount } = render(
      <ContactDetails profile={empty} onProfileChange={onChange} />,
    );
    expect(screen.getByText('No links yet')).toBeInTheDocument();
    const addBtn = screen.getByRole('button', { name: /Add link/i });
    await user.click(addBtn);
    const dialog = await screen.findByRole('dialog', { name: /Add link/i });
    expect(dialog).toBeInTheDocument();
    const urlInput = screen.getByLabelText('URL');
    await user.type(urlInput, 'ftp://bad.example');
    await user.click(screen.getByRole('button', { name: /^Add$/ }));
    expect(
      await screen.findByText('Enter a valid http(s) URL'),
    ).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
    await user.clear(urlInput);
    await user.type(urlInput, '  https://example.com/new  ');
    const labelInput = screen.getByLabelText('Label');
    await user.clear(labelInput);
    await user.type(labelInput, '   ');
    const githubOption = await screen.findByText('GitHub');
    await user.click(githubOption);
    await user.click(screen.getByRole('button', { name: /^Add$/ }));
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.personalInfo.links).toHaveLength(1);
    expect(next.personalInfo.links[0].url).toBe('https://example.com/new');
    expect(next.personalInfo.links[0].type).toBe('github');
    expect(next.personalInfo.links[0].label).toBeNull();
    expect(next.personalInfo.links[0]).not.toHaveProperty('id');
    expect(empty.personalInfo.links).toHaveLength(0);
    unmount();
  });

  it('ContactDetails remove link calls onProfileChange without removed link', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { unmount } = render(
      <ContactDetails profile={profile} onProfileChange={onChange} />,
    );
    const removeBtn = screen.getByLabelText(
      'Remove github link https://github.com/ada',
    );
    await user.click(removeBtn);
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.personalInfo.links).toHaveLength(1);
    expect(next.personalInfo.links[0].url).toBe('https://ada.dev');
    expect(profile.personalInfo.links).toHaveLength(2);
    unmount();
  });

  it('ContactDetails label empty and whitespace becomes null on submit', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { unmount } = render(
      <ContactDetails profile={profile} onProfileChange={onChange} />,
    );
    const labelDisplay = screen.getAllByLabelText('Edit Label')[0];
    await user.dblClick(labelDisplay);
    const labelInput = screen.getByLabelText('Label');
    await user.clear(labelInput);
    await user.type(labelInput, '   ');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.personalInfo.links[0].label).toBeNull();
    expect(profile.personalInfo.links[0].label).toBe('GitHub');
    onChange.mockClear();
    unmount();
    const profile2 = makeProfile();
    const onChange2 = vi.fn();
    const user2 = userEvent.setup();
    const { unmount: unmount2 } = render(
      <ContactDetails profile={profile2} onProfileChange={onChange2} />,
    );
    const labelDisplay2 = screen.getAllByLabelText('Edit Label')[0];
    await user2.dblClick(labelDisplay2);
    const labelInput2 = screen.getByLabelText('Label');
    await user2.clear(labelInput2);
    await user2.type(labelInput2, '  My Label  ');
    await user2.keyboard('{Enter}');
    await waitFor(() => expect(onChange2).toHaveBeenCalledTimes(1));
    expect(onChange2.mock.calls[0][0].personalInfo.links[0].label).toBe(
      'My Label',
    );
    unmount2();
  });

  it('ContactDetails empty state shows No links yet and Add link affordance', async () => {
    const empty = makeProfile({
      personalInfo: {
        fullName: 'Ada',
        email: 'a@a.com',
        links: [],
        location: null as unknown as components['schemas']['Location'],
      } as unknown as components['schemas']['PersonalInfo'],
    });
    const noop = vi.fn();
    render(<ContactDetails profile={empty} onProfileChange={noop} />);
    expect(screen.getByText('No links yet')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Add link/i }),
    ).toBeInTheDocument();
  });
  it('ExperienceSection companyLocation edits via UI are immutable and blank -> null', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ExperienceSection profile={profile} onProfileChange={onChange} />);
    const cityDisplay = screen.getAllByLabelText('Edit City')[0];
    await user.dblClick(cityDisplay);
    const cityInput = screen.getByLabelText('City');
    await user.clear(cityInput);
    await user.type(cityInput, 'Berlin');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.experience[0].companyLocation?.city).toBe('Berlin');
    expect(profile.experience[0].companyLocation).toBeNull();
    onChange.mockClear();
    const regionDisplay = screen.getAllByLabelText('Edit Region')[0];
    await user.dblClick(regionDisplay);
    const regionInput = screen.getByLabelText('Region');
    await user.clear(regionInput);
    await user.type(regionInput, 'BerlinRegion');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    expect(
      onChange.mock.calls[0][0].experience[0].companyLocation?.region,
    ).toBe('BerlinRegion');
    onChange.mockClear();
    const countryDisplay = screen.getAllByLabelText('Edit Country code')[0];
    await user.dblClick(countryDisplay);
    const countryInput = screen.getByLabelText('Country code');
    await user.clear(countryInput);
    await user.type(countryInput, 'DE');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    expect(
      onChange.mock.calls[0][0].experience[0].companyLocation?.countryCode,
    ).toBe('DE');
    onChange.mockClear();
    // blank -> null
    await user.dblClick(screen.getAllByLabelText('Edit City')[0]);
    const cityInput2 = screen.getByLabelText('City');
    await user.clear(cityInput2);
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    expect(
      onChange.mock.calls[0][0].experience[0].companyLocation?.city,
    ).toBeNull();
  });

  it('ExperienceSection responsibilities add/remove via UI are immutable', async () => {
    const profile = makeProfile();
    const onChange = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ExperienceSection profile={profile} onProfileChange={onChange} />);
    const addBtn = screen.getAllByRole('button', {
      name: 'Add responsibility',
    })[0];
    await user.click(addBtn);
    const dialog = await screen.findByRole('dialog', {
      name: /Add responsibility/i,
    });
    expect(dialog).toBeInTheDocument();
    const input = screen.getByLabelText('Responsibility');
    await user.type(input, 'new resp via profile');
    await user.click(screen.getByRole('button', { name: /^Add$/ }));
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.experience[0].responsibilities).toContain(
      'new resp via profile',
    );
    expect(profile.experience[0].responsibilities).toEqual([
      'resp one',
      'resp two',
    ]);
    onChange.mockClear();
    const removeBtn = screen.getAllByRole('button', {
      name: /Remove responsibility/i,
    })[0];
    await user.click(removeBtn);
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const nextRem = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(nextRem.experience[0].responsibilities).toEqual(['resp two']);
  });

  it('ExperienceSection achievements add/remove via UI handle empty and immutable', async () => {
    const emptyAchProfile = makeProfile({
      experience: [
        {
          id: '10000000-0000-4000-a000-000000000001',
          company: 'OldCo',
          companyLocation: null,
          position: 'Developer',
          employmentType: 'full-time',
          locationType: 'remote',
          startDate: '2020-01',
          endDate: null,
          summary: 'exp summary',
          responsibilities: null,
          achievements: [],
          skillRefs: ['a1b2c3d4-e5f6-4a7b-8c9d-111111111111'],
        },
      ],
    } as unknown as CandidateProfileV1);
    const onChange = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(
      <ExperienceSection
        profile={emptyAchProfile}
        onProfileChange={onChange}
      />,
    );
    const addBtn = screen.getByRole('button', { name: 'Add achievement' });
    await user.click(addBtn);
    const dialog = await screen.findByRole('dialog', {
      name: /Add achievement/i,
    });
    expect(dialog).toBeInTheDocument();
    const input = screen.getByLabelText('Achievement');
    await user.type(input, 'added ach');
    await user.click(screen.getByRole('button', { name: /^Add$/ }));
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.experience[0].achievements).toEqual(['added ach']);
    expect(emptyAchProfile.experience[0].achievements).toEqual([]);
    onChange.mockClear();
    // remove path with existing achievement
    const profile2 = makeProfile();
    const onChange2 = vi.fn();
    const user2 = userEvent.setup();
    const { unmount } = render(
      <ExperienceSection profile={profile2} onProfileChange={onChange2} />,
    );
    const removeBtn = screen.getAllByRole('button', {
      name: /Remove achievement/i,
    })[0];
    await user2.click(removeBtn);
    await waitFor(() => expect(onChange2).toHaveBeenCalledTimes(1));
    const nextRem = onChange2.mock.calls[0][0] as CandidateProfileV1;
    expect(nextRem.experience[0].achievements).toEqual([]);
    expect(profile2.experience[0].achievements).toEqual(['ach one']);
    unmount();
  });
});
