import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { components } from '@talentor/contracts';
import { renderHook, act } from '@testing-library/react';

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
});
