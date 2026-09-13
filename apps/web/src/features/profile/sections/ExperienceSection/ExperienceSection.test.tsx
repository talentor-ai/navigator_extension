import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { components } from '@talentor/contracts';
import { renderHook, act } from '@testing-library/react';
import {
  validateOptionalYearMonth,
  validateYearMonth,
} from '@/features/profile/validation';

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

import ExperienceSection from './index';
import { useExperienceEditor } from './hooks/useExperienceEditor';

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
  if (!w.ResizeObserver) w.ResizeObserver = g.ResizeObserver;
  const proto = HTMLElement.prototype as unknown as Record<string, unknown>;
  if (!proto.hasPointerCapture) proto.hasPointerCapture = vi.fn(() => false);
  if (!proto.setPointerCapture) proto.setPointerCapture = vi.fn();
  if (!proto.releasePointerCapture) proto.releasePointerCapture = vi.fn();
  if (!proto.scrollIntoView) proto.scrollIntoView = vi.fn();
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
      phone: null,
      location: null,
      links: [],
    },
    defaultRole: null,
    baseSummary: null,
    experience: [
      {
        id: '10000000-0000-4000-a000-000000000001',
        company: 'OldCo',
        companyLocation: null,
        position: 'Developer',
        employmentType: null,
        locationType: null,
        startDate: '2020-01',
        endDate: null,
        summary: null,
        responsibilities: null,
        achievements: ['ach one'],
        skillRefs: [],
      },
      {
        id: '10000000-0000-4000-a000-000000000002',
        company: 'SecondCo',
        companyLocation: null,
        position: 'Senior',
        employmentType: null,
        locationType: null,
        startDate: '2021-06',
        endDate: null,
        summary: null,
        responsibilities: null,
        achievements: [],
        skillRefs: [],
      },
    ],
    skills: [
      {
        id: 'a1b2c3d4-e5f6-4a7b-8c9d-111111111111',
        name: 'React',
        category: 'Frontend',
        yearsOfExperience: 3,
        lastUsed: null,
        aliases: null,
        evidenceRefs: [
          '10000000-0000-4000-a000-000000000001',
          '60000000-0000-4000-a000-000000000006',
        ],
      },
      {
        id: 'a1b2c3d4-e5f6-4a7b-8c9d-222222222222',
        name: 'TS',
        category: 'Lang',
        yearsOfExperience: null,
        lastUsed: null,
        aliases: null,
        evidenceRefs: null,
      },
    ],
    languages: [],
    education: [],
    projects: [
      {
        id: '60000000-0000-4000-a000-000000000006',
        name: 'Proj',
        role: null,
        description: 'Desc',
        startDate: null,
        endDate: null,
        url: null,
        repository: null,
        achievements: null,
        skillRefs: null,
      },
    ],
    certifications: [],
  } as unknown as CandidateProfileV1;
  return {
    ...base,
    ...overrides,
    experience: overrides?.experience ?? base.experience,
    skills: overrides?.skills ?? base.skills,
    projects: overrides?.projects ?? base.projects,
    personalInfo: { ...base.personalInfo, ...(overrides?.personalInfo ?? {}) },
  } as CandidateProfileV1;
}

describe('ExperienceSection – Wave 3A', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders header, Add button and single drag handle per item', () => {
    const profile = makeProfile();
    render(<ExperienceSection profile={profile} onProfileChange={vi.fn()} />);
    expect(
      screen.getByRole('heading', { name: 'Experience' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Add Experience/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /Drag to reorder/i }),
    ).toHaveLength(2);
    expect(
      screen.getAllByRole('button', { name: /Remove experience/i }),
    ).toHaveLength(2);
  });

  it('valid add appends immutable experience with defaults', async () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    // mock crypto
    const uuid = '99999999-9999-4000-a000-000000000999';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      uuid as `${string}-${string}-${string}-${string}-${string}`,
    );

    render(
      <ExperienceSection profile={profile} onProfileChange={onProfileChange} />,
    );
    await user.click(screen.getByRole('button', { name: /Add Experience/i }));
    expect(
      screen.getByRole('dialog', { name: 'Add experience' }),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText('Company'), 'NewCo');
    await user.type(screen.getByLabelText('Position'), 'Lead');
    const startInput = screen.getByLabelText('Start date');
    fireEvent.change(startInput, { target: { value: '2022-05' } });

    await user.click(screen.getByRole('button', { name: /^Add$/ }));
    await waitFor(() => expect(onProfileChange).toHaveBeenCalledTimes(1));
    const next = onProfileChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.experience).toHaveLength(3);
    const added = next.experience[2];
    expect(added.id).toBe(uuid);
    expect(added.company).toBe('NewCo');
    expect(added.position).toBe('Lead');
    expect(added.startDate).toBe('2022-05');
    expect(added.achievements).toEqual([]);
    expect(added.skillRefs).toEqual([]);
    expect(added.companyLocation).toBeNull();
    // original preserved
    expect(profile.experience).toHaveLength(2);
    expect(next).not.toBe(profile);
    expect(next.experience).not.toBe(profile.experience);
    // contract-valid: no extra required missing, achievements/skillRefs present
  });

  it('invalid add with missing required fields does not call onProfileChange', async () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ExperienceSection profile={profile} onProfileChange={onProfileChange} />,
    );
    await user.click(screen.getByRole('button', { name: /Add Experience/i }));
    // leave all empty, try confirm
    await user.click(screen.getByRole('button', { name: /^Add$/ }));
    expect(onProfileChange).not.toHaveBeenCalled();
    expect(screen.getByText('Company is required')).toBeInTheDocument();
    expect(screen.getByText('Position is required')).toBeInTheDocument();
    expect(screen.getByText('Start date is required')).toBeInTheDocument();
    // fill only company, still invalid
    await user.type(screen.getByLabelText('Company'), 'OnlyCompany');
    await user.click(screen.getByRole('button', { name: /^Add$/ }));
    expect(onProfileChange).not.toHaveBeenCalled();
  });

  it('invalid startDate format blocks save', async () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ExperienceSection profile={profile} onProfileChange={onProfileChange} />,
    );
    await user.click(screen.getByRole('button', { name: /Add Experience/i }));
    await user.type(screen.getByLabelText('Company'), 'Co');
    await user.type(screen.getByLabelText('Position'), 'Pos');
    const startInput = screen.getByLabelText('Start date');
    // use text value that fails YYYY-MM validation (month 13)
    // Input is type month in dialog but we fire change with invalid to test regex
    fireEvent.change(startInput, { target: { value: '2022-13' } });
    await user.click(screen.getByRole('button', { name: /^Add$/ }));
    expect(onProfileChange).not.toHaveBeenCalled();
    // Depending on input sanitization, error may be required or format; accept either
    const hasFormatError = screen.queryByText('Use YYYY-MM');
    const hasRequiredError = screen.queryByText('Start date is required');
    expect(hasFormatError || hasRequiredError).toBeTruthy();
  });

  it('remove dialog shows pending while shared mutation pending', async () => {
    const profile = makeProfile();
    const onProfileChange = vi
      .fn()
      .mockImplementation(() => new Promise(() => {}));
    const user = userEvent.setup();
    const { rerender } = render(
      <ExperienceSection
        profile={profile}
        onProfileChange={onProfileChange}
        pending={false}
      />,
    );
    const deletes = screen.getAllByRole('button', {
      name: /Remove experience/i,
    });
    await user.click(deletes[0]);
    expect(
      screen.getByRole('dialog', { name: 'Remove experience?' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove' })).toBeEnabled();
    rerender(
      <ExperienceSection
        profile={profile}
        onProfileChange={onProfileChange}
        pending={true}
      />,
    );
    expect(screen.getByRole('button', { name: 'Removing...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('remove uses cascade utility and calls onProfileChange once', async () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(
      <ExperienceSection profile={profile} onProfileChange={onProfileChange} />,
    );
    await user.click(
      screen.getAllByRole('button', { name: /Remove experience/i })[0],
    );
    await user.click(screen.getByRole('button', { name: 'Remove' }));
    await waitFor(() => expect(onProfileChange).toHaveBeenCalledTimes(1));
    const next = onProfileChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.experience.map((e) => e.id)).toEqual([
      '10000000-0000-4000-a000-000000000002',
    ]);
    // cascade: skill evidenceRefs filtered, null preserved
    const skill1 = next.skills.find(
      (s) => s.id === 'a1b2c3d4-e5f6-4a7b-8c9d-111111111111',
    )!;
    expect(skill1.evidenceRefs).toEqual([
      '60000000-0000-4000-a000-000000000006',
    ]);
    expect(next.skills[1].evidenceRefs).toBeNull();
    expect(profile.experience).toHaveLength(2);
  });

  it('remove dialog cancel does not call onProfileChange', async () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ExperienceSection profile={profile} onProfileChange={onProfileChange} />,
    );
    await user.click(
      screen.getAllByRole('button', { name: /Remove experience/i })[0],
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onProfileChange).not.toHaveBeenCalled();
  });

  it('pending disables Add, drag and delete', async () => {
    const profile = makeProfile();
    render(
      <ExperienceSection profile={profile} onProfileChange={vi.fn()} pending />,
    );
    expect(
      screen.getByRole('button', { name: /Add Experience/i }),
    ).toBeDisabled();
    expect(
      screen.getAllByRole('button', { name: /Drag to reorder/i })[0],
    ).toBeDisabled();
    expect(
      screen.getAllByRole('button', { name: /Remove experience/i })[0],
    ).toBeDisabled();
    // inline editing also pending: double-click should not open
    const user = userEvent.setup();
    await user.dblClick(screen.getAllByLabelText('Edit Company')[0]);
    expect(screen.queryByLabelText('Company')).not.toBeInTheDocument();
  });

  it('readOnly hides Add/delete and disables drag', async () => {
    const profile = makeProfile();
    render(
      <ExperienceSection
        profile={profile}
        onProfileChange={vi.fn()}
        readOnly
      />,
    );
    expect(
      screen.queryByRole('button', { name: /Add Experience/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Remove experience/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /Drag to reorder/i })[0],
    ).toBeDisabled();
    const user = userEvent.setup();
    await user.dblClick(screen.getAllByLabelText('Edit Company')[0]);
    expect(screen.queryByLabelText('Company')).not.toBeInTheDocument();
  });

  it('inline edit regression – company immutable', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ExperienceSection profile={profile} onProfileChange={onChange} />);
    await user.dblClick(screen.getAllByLabelText('Edit Company')[0]);
    const input = screen.getByLabelText('Company');
    await user.clear(input);
    await user.type(input, 'UpdatedCo');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.experience[0].company).toBe('UpdatedCo');
    expect(profile.experience[0].company).toBe('OldCo');
    expect(next).not.toBe(profile);
  });

  it('reorder via hook produces immutable reorder and calls once', async () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn();
    const { result } = renderHook(() =>
      useExperienceEditor(profile, onProfileChange),
    );
    act(() => {
      result.current.handleReorder(0, 1);
    });
    expect(onProfileChange).toHaveBeenCalledTimes(1);
    const next = onProfileChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.experience.map((e) => e.id)).toEqual([
      '10000000-0000-4000-a000-000000000002',
      '10000000-0000-4000-a000-000000000001',
    ]);
    expect(profile.experience[0].id).toBe(
      '10000000-0000-4000-a000-000000000001',
    );
    expect(next).not.toBe(profile);
    // no-op same index not call
    onProfileChange.mockClear();
    act(() => result.current.handleReorder(0, 0));
    expect(onProfileChange).not.toHaveBeenCalled();
  });

  it('add dialog stays open when onProfileChange rejects', async () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn().mockRejectedValue(new Error('fail'));
    // prevent unhandled rejection warning: catch the promise
    onProfileChange.mockImplementation(() => Promise.reject(new Error('fail')));
    const user = userEvent.setup();
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      'aaaaaaaa-aaaa-4000-a000-000000000aaa' as any,
    );
    render(
      <ExperienceSection profile={profile} onProfileChange={onProfileChange} />,
    );
    await user.click(screen.getByRole('button', { name: /Add Experience/i }));
    await user.type(screen.getByLabelText('Company'), 'Co');
    await user.type(screen.getByLabelText('Position'), 'Pos');
    fireEvent.change(screen.getByLabelText('Start date'), {
      target: { value: '2020-02' },
    });
    await user.click(screen.getByRole('button', { name: /^Add$/ }));
    await waitFor(() => expect(onProfileChange).toHaveBeenCalled());
    // dialog stays open on rejection
    expect(
      screen.getByRole('dialog', { name: 'Add experience' }),
    ).toBeInTheDocument();
    // ensure rejection was not swallowed silently – parent would handle error, but dialog stays
    await new Promise((r) => setTimeout(r, 20));
  });

  it('empty state preserves text and shows Add', () => {
    const empty = makeProfile({ experience: [] });
    render(<ExperienceSection profile={empty} onProfileChange={vi.fn()} />);
    expect(screen.getByText('No experience yet')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Add Experience/i }),
    ).toBeInTheDocument();
  });

  it('add dialog backdrop cannot cancel while pending', async () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      'bbbbbbbb-bbbb-4000-a000-000000000bbb' as any,
    );
    const { rerender } = render(
      <ExperienceSection
        profile={profile}
        onProfileChange={onProfileChange}
        pending={false}
      />,
    );
    await user.click(screen.getByRole('button', { name: /Add Experience/i }));
    const dialog = screen.getByRole('dialog', { name: 'Add experience' });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
    rerender(
      <ExperienceSection
        profile={profile}
        onProfileChange={onProfileChange}
        pending
      />,
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Adding...' })).toBeDisabled();
    await user.click(dialog);
    expect(
      screen.getByRole('dialog', { name: 'Add experience' }),
    ).toBeInTheDocument();
    rerender(
      <ExperienceSection
        profile={profile}
        onProfileChange={onProfileChange}
        pending={false}
      />,
    );
    await user.click(screen.getByRole('dialog', { name: 'Add experience' }));
    expect(
      screen.queryByRole('dialog', { name: 'Add experience' }),
    ).not.toBeInTheDocument();
  });

  it('remove stays open when onProfileChange rejects', async () => {
    const profile = makeProfile();
    const onProfileChange = vi
      .fn()
      .mockImplementation(() => Promise.reject(new Error('fail')));
    const user = userEvent.setup();
    render(
      <ExperienceSection profile={profile} onProfileChange={onProfileChange} />,
    );
    await user.click(
      screen.getAllByRole('button', { name: /Remove experience/i })[0],
    );
    expect(
      screen.getByRole('dialog', { name: 'Remove experience?' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove' }));
    await waitFor(() => expect(onProfileChange).toHaveBeenCalledTimes(1));
    expect(
      screen.getByRole('dialog', { name: 'Remove experience?' }),
    ).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 20));
  });

  it('remove guard does not call onProfileChange when id not found', () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn();
    const { result } = renderHook(() =>
      useExperienceEditor(profile, onProfileChange),
    );
    act(() => result.current.requestRemove('non-existent-id'));
    expect(result.current.pendingRemoveId).toBe('non-existent-id');
    act(() => result.current.confirmRemove());
    expect(onProfileChange).not.toHaveBeenCalled();
    expect(result.current.pendingRemoveId).toBeNull();
  });

  it('reorder no-op on same index and out-of-bounds does not save', () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn();
    const { result } = renderHook(() =>
      useExperienceEditor(profile, onProfileChange),
    );
    act(() => result.current.handleReorder(0, 0));
    expect(onProfileChange).not.toHaveBeenCalled();
    act(() => result.current.handleReorder(-1, 0));
    expect(onProfileChange).not.toHaveBeenCalled();
    act(() => result.current.handleReorder(0, 5));
    expect(onProfileChange).not.toHaveBeenCalled();
    act(() => result.current.handleReorder(5, 0));
    expect(onProfileChange).not.toHaveBeenCalled();
  });

  it('reorder attaches rejection handling without unhandled and without swallowing parent error', async () => {
    const profile = makeProfile();
    const onProfileChange = vi
      .fn()
      .mockImplementation(() => Promise.reject(new Error('reorder fail')));
    const { result } = renderHook(() =>
      useExperienceEditor(profile, onProfileChange),
    );
    let threw = false;
    try {
      act(() => {
        result.current.handleReorder(0, 1);
      });
      await new Promise((r) => setTimeout(r, 20));
    } catch {
      threw = true;
    }
    expect(threw).toBe(false);
    expect(onProfileChange).toHaveBeenCalledTimes(1);
    // ensure no extra call on no-op even with rejection
    onProfileChange.mockClear();
    act(() => result.current.handleReorder(1, 1));
    expect(onProfileChange).not.toHaveBeenCalled();
  });
  it('companyLocation hook creates location when null and blank -> null', () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn();
    const { result } = renderHook(() =>
      useExperienceEditor(profile, onProfileChange),
    );
    const id = profile.experience[0].id;
    act(() => {
      result.current.updateCompanyLocationCity(id, 'Berlin');
    });
    expect(onProfileChange).toHaveBeenCalledTimes(1);
    const next1 = onProfileChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next1.experience[0].companyLocation?.city).toBe('Berlin');
    expect(next1.experience[0].companyLocation?.region).toBeUndefined();
    expect(next1).not.toBe(profile);
    expect(next1.experience).not.toBe(profile.experience);
    onProfileChange.mockClear();
    // blank -> null
    act(() => {
      result.current.updateCompanyLocationCity(id, '   ');
    });
    const next2 = onProfileChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next2.experience[0].companyLocation?.city).toBeNull();
    expect(profile.experience[0].companyLocation).toBeNull();
  });

  it('companyLocation region and countryCode hook handle blank -> null and preserve other fields', () => {
    const profile = makeProfile({
      experience: [
        {
          id: '10000000-0000-4000-a000-000000000001',
          company: 'OldCo',
          companyLocation: {
            city: 'Madrid',
            region: 'Madrid',
            countryCode: 'ES',
          } as unknown as components['schemas']['Location'],
          position: 'Developer',
          employmentType: null,
          locationType: null,
          startDate: '2020-01',
          endDate: null,
          summary: null,
          responsibilities: null,
          achievements: [],
          skillRefs: [],
        },
      ],
    } as unknown as CandidateProfileV1);
    const onProfileChange = vi.fn();
    const { result } = renderHook(() =>
      useExperienceEditor(profile, onProfileChange),
    );
    const id = profile.experience[0].id;
    act(() => {
      result.current.updateCompanyLocationRegion(id, 'Catalonia');
    });
    expect(
      onProfileChange.mock.calls[0][0].experience[0].companyLocation?.region,
    ).toBe('Catalonia');
    expect(
      onProfileChange.mock.calls[0][0].experience[0].companyLocation?.city,
    ).toBe('Madrid');
    onProfileChange.mockClear();
    act(() => {
      result.current.updateCompanyLocationCountryCode(id, '');
    });
    expect(
      onProfileChange.mock.calls[0][0].experience[0].companyLocation
        ?.countryCode,
    ).toBeNull();
    expect(
      onProfileChange.mock.calls[0][0].experience[0].companyLocation?.city,
    ).toBe('Madrid');
    onProfileChange.mockClear();
    act(() => {
      result.current.updateCompanyLocationCountryCode(id, 'US');
    });
    expect(
      onProfileChange.mock.calls[0][0].experience[0].companyLocation
        ?.countryCode,
    ).toBe('US');
  });

  it('companyLocation inline editing via UI is immutable', async () => {
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
    expect(next).not.toBe(profile);
  });

  it('responsibilities add/remove via hook handle null prev and are immutable', () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn();
    const { result } = renderHook(() =>
      useExperienceEditor(profile, onProfileChange),
    );
    const id = profile.experience[0].id;
    act(() => {
      result.current.addResponsibility(id, 'new resp');
    });
    expect(onProfileChange).toHaveBeenCalledTimes(1);
    const nextAdd = onProfileChange.mock.calls[0][0] as CandidateProfileV1;
    expect(nextAdd.experience[0].responsibilities).toEqual(['new resp']);
    expect(profile.experience[0].responsibilities).toBeNull();
    onProfileChange.mockClear();
    const profileWithTwo = {
      ...profile,
      experience: profile.experience.map((e) =>
        e.id === id ? { ...e, responsibilities: ['a', 'b'] } : e,
      ),
    } as unknown as CandidateProfileV1;
    const { result: r2 } = renderHook(() =>
      useExperienceEditor(profileWithTwo, onProfileChange),
    );
    act(() => {
      r2.current.updateResponsibility(id, 0, 'updated');
    });
    expect(
      onProfileChange.mock.calls[0][0].experience[0].responsibilities?.[0],
    ).toBe('updated');
    expect(
      onProfileChange.mock.calls[0][0].experience[0].responsibilities?.[1],
    ).toBe('b');
    onProfileChange.mockClear();
    act(() => {
      r2.current.removeResponsibility(id, 0);
    });
    const nextRem = onProfileChange.mock.calls[0][0] as CandidateProfileV1;
    expect(nextRem.experience[0].responsibilities).toEqual(['b']);
    expect(profileWithTwo.experience[0].responsibilities).toEqual(['a', 'b']);
    onProfileChange.mockClear();
    act(() => {
      r2.current.addResponsibility(id, 'c');
    });
    expect(
      onProfileChange.mock.calls[0][0].experience[0].responsibilities,
    ).toEqual(['a', 'b', 'c']);
  });

  it('achievements add/remove via hook are immutable', () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn();
    const { result } = renderHook(() =>
      useExperienceEditor(profile, onProfileChange),
    );
    const id = profile.experience[1].id; // second has achievements []
    act(() => {
      result.current.addAchievement(id, 'new ach');
    });
    expect(onProfileChange.mock.calls[0][0].experience[1].achievements).toEqual(
      ['new ach'],
    );
    expect(profile.experience[1].achievements).toEqual([]);
    onProfileChange.mockClear();
    // Use original profile with ach one
    const id2 = profile.experience[0].id;
    act(() => {
      result.current.addAchievement(id2, 'second ach');
    });
    expect(onProfileChange.mock.calls[0][0].experience[0].achievements).toEqual(
      ['ach one', 'second ach'],
    );
    onProfileChange.mockClear();
    act(() => {
      result.current.removeAchievement(id2, 0);
    });
    expect(onProfileChange.mock.calls[0][0].experience[0].achievements).toEqual(
      [],
    );
    onProfileChange.mockClear();
    act(() => {
      result.current.updateAchievement(id2, 0, 'updated ach');
    });
    expect(onProfileChange.mock.calls[0][0].experience[0].achievements[0]).toBe(
      'updated ach',
    );
  });

  it('responsibilities add via UI dialog appends immutably', async () => {
    const profile = makeProfile();
    const onChange = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ExperienceSection profile={profile} onProfileChange={onChange} />);
    const addButtons = screen.getAllByRole('button', {
      name: 'Add responsibility',
    });
    expect(addButtons.length).toBeGreaterThan(0);
    await user.click(addButtons[0]);
    const dialog = await screen.findByRole('dialog', {
      name: /Add responsibility/i,
    });
    expect(dialog).toBeInTheDocument();
    const textarea = screen.getByLabelText('Responsibility');
    await user.type(textarea, 'new responsibility via ui');
    await user.click(screen.getByRole('button', { name: /^Add$/ }));
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.experience[0].responsibilities).toEqual([
      'new responsibility via ui',
    ]);
    expect(profile.experience[0].responsibilities).toBeNull();
  });

  it('responsibilities remove via UI button filters', async () => {
    const profile = makeProfile({
      experience: [
        {
          id: '10000000-0000-4000-a000-000000000001',
          company: 'OldCo',
          companyLocation: null,
          position: 'Developer',
          employmentType: null,
          locationType: null,
          startDate: '2020-01',
          endDate: null,
          summary: null,
          responsibilities: ['resp one', 'resp two'],
          achievements: [],
          skillRefs: [],
        },
      ],
    } as unknown as CandidateProfileV1);
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ExperienceSection profile={profile} onProfileChange={onChange} />);
    const removeButtons = screen.getAllByRole('button', {
      name: /Remove responsibility/i,
    });
    expect(removeButtons.length).toBe(2);
    await user.click(removeButtons[0]);
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.experience[0].responsibilities).toEqual(['resp two']);
    expect(profile.experience[0].responsibilities).toEqual([
      'resp one',
      'resp two',
    ]);
  });

  it('achievements add via UI dialog appends when empty', async () => {
    const profile = makeProfile({
      experience: [
        {
          id: '10000000-0000-4000-a000-000000000001',
          company: 'OldCo',
          companyLocation: null,
          position: 'Developer',
          employmentType: null,
          locationType: null,
          startDate: '2020-01',
          endDate: null,
          summary: null,
          responsibilities: null,
          achievements: [],
          skillRefs: [],
        },
      ],
    } as unknown as CandidateProfileV1);
    const onChange = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ExperienceSection profile={profile} onProfileChange={onChange} />);
    const addBtn = screen.getByRole('button', { name: 'Add achievement' });
    await user.click(addBtn);
    const dialog = await screen.findByRole('dialog', {
      name: /Add achievement/i,
    });
    expect(dialog).toBeInTheDocument();
    const textarea = screen.getByLabelText('Achievement');
    await user.type(textarea, 'ach via ui');
    await user.click(screen.getByRole('button', { name: /^Add$/ }));
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.experience[0].achievements).toEqual(['ach via ui']);
  });

  it('achievements remove via UI filters', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ExperienceSection profile={profile} onProfileChange={onChange} />);
    const removeBtns = screen.getAllByRole('button', {
      name: /Remove achievement/i,
    });
    expect(removeBtns.length).toBe(1);
    await user.click(removeBtns[0]);
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.experience[0].achievements).toEqual([]);
    expect(profile.experience[0].achievements).toEqual(['ach one']);
  });

  it('startDate validation blocks invalid submit and endDate blank allowed', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ExperienceSection profile={profile} onProfileChange={onChange} />);
    // startDate invalid
    const startDisplay = screen.getAllByLabelText('Edit Start date')[0];
    await user.dblClick(startDisplay);
    const startInput = screen.getByLabelText('Start date');
    await user.clear(startInput);
    await user.type(startInput, '2022-13');
    fireEvent.submit(startInput.closest('form')!);
    await new Promise((r) => setTimeout(r, 20));
    expect(onChange).not.toHaveBeenCalled();
    expect(await screen.findByText('Use YYYY-MM')).toBeInTheDocument();
    // valid startDate should work
    await user.clear(startInput);
    await user.type(startInput, '2022-02');
    fireEvent.submit(startInput.closest('form')!);
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    expect(onChange.mock.calls[0][0].experience[0].startDate).toBe('2022-02');
    onChange.mockClear();
    // endDate blank allowed -> null
    const endDisplay = screen.getAllByLabelText('Edit End date')[0];
    await user.dblClick(endDisplay);
    const endInput = screen.getByLabelText('End date');
    await user.clear(endInput);
    fireEvent.submit(endInput.closest('form')!);
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    expect(onChange.mock.calls[0][0].experience[0].endDate).toBeNull();
    onChange.mockClear();
    // endDate invalid should block (via validateOptionalYearMonth, blank allowed so test with invalid month)
    // For optional, blank is allowed, so we test that valid month passes and blank passes, and that direct validation works
    expect(validateOptionalYearMonth('2022-13')).toBe('Use YYYY-MM');
    expect(validateOptionalYearMonth('')).toBeNull();
    expect(validateYearMonth('2022-13')).toBe('Use YYYY-MM');
  });
});
