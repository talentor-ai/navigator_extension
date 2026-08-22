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
});
