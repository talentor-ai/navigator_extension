import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { components } from '@talentor/contracts';
import EducationSection from './index';
import { AddEducationDialog } from './components/AddEducationDialog';
import { EducationItem } from './components/EducationItem';

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
      fullName: 'Ada',
      email: 'ada@example.com',
      links: [],
    },
    defaultRole: null,
    baseSummary: null,
    experience: [],
    skills: [],
    languages: [],
    education: [
      {
        id: 'edu-1',
        institution: 'Uni A',
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
    projects: [],
    certifications: [],
  } as unknown as CandidateProfileV1;
  return {
    ...base,
    ...overrides,
    personalInfo: { ...base.personalInfo, ...(overrides?.personalInfo ?? {}) },
    education: overrides?.education ?? base.education,
  } as CandidateProfileV1;
}

describe('EducationSection', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders empty state and Add button', () => {
    const profile = makeProfile({ education: [] });
    render(<EducationSection profile={profile} onProfileChange={vi.fn()} />);
    expect(screen.getByText('No education yet')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Education' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Add Education/i }),
    ).toBeInTheDocument();
  });

  it('valid add creates UUID payload with only institution minimal', async () => {
    const profile = makeProfile({ education: [] });
    const onChange = vi.fn();
    const uuid = '33333333-3333-4333-8333-333333333333';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      uuid as `${string}-${string}-${string}-${string}-${string}`,
    );
    const user = userEvent.setup();
    render(<EducationSection profile={profile} onProfileChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /Add Education/i }));
    expect(
      screen.getByRole('dialog', { name: 'Add education' }),
    ).toBeInTheDocument();

    const institutionInput = screen.getByLabelText('Institution');
    await user.type(institutionInput, 'MIT');

    await user.click(screen.getByRole('button', { name: /^Add$/i }));

    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.education).toHaveLength(1);
    const added = next.education[0];
    expect(added.id).toBe(uuid);
    expect(added.institution).toBe('MIT');
    expect(Object.keys(added).sort()).toEqual(['id', 'institution'].sort());
    expect(next).not.toBe(profile);
    expect(profile.education).toHaveLength(0);
  });

  it('validation prevents save when institution missing', async () => {
    const profile = makeProfile({ education: [] });
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<EducationSection profile={profile} onProfileChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /Add Education/i }));
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(onChange).not.toHaveBeenCalled();
    expect(
      await screen.findByText('Institution is required'),
    ).toBeInTheDocument();

    const input = screen.getByLabelText('Institution');
    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('reorder persists array order via handler', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const { reorder } = await import('../../collections');
    const reordered = reorder(profile.education, 0, 1);
    expect(reordered[0].id).toBe('edu-2');
    expect(reordered[1].id).toBe('edu-1');

    const { renderHook, act } = await import('@testing-library/react');
    const { useEducationSection } = await import('./hooks/useEducationSection');
    const { result } = renderHook(() => useEducationSection(profile, onChange));
    act(() => result.current.handleReorder(0, 1));
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.education[0].id).toBe('edu-2');
    expect(next.education[1].id).toBe('edu-1');
    expect(next.education).not.toBe(profile.education);
    expect(profile.education[0].id).toBe('edu-1');
  });

  it('remove confirmed cleans education array preserving other collections', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<EducationSection profile={profile} onProfileChange={onChange} />);

    const deleteBtn = screen.getByRole('button', { name: /Remove Uni A/i });
    await user.click(deleteBtn);

    expect(
      screen.getByRole('dialog', { name: /Remove Uni A\?/i }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove' }));

    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.education.map((e) => e.id)).toEqual(['edu-2']);
    expect(next.skills).toBe(profile.skills);
    expect(profile.education).toHaveLength(2);
  });

  it('cancel remove does not call onProfileChange', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<EducationSection profile={profile} onProfileChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /Remove Uni A/i }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('pending disables Add and delete and drag', () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    render(
      <EducationSection profile={profile} onProfileChange={onChange} pending />,
    );

    const addBtn = screen.getByRole('button', { name: /Add Education/i });
    expect(addBtn).toBeDisabled();
    expect(addBtn).toHaveAttribute('aria-busy', 'true');

    const deleteBtn = screen.getByRole('button', { name: /Remove Uni A/i });
    expect(deleteBtn).toBeDisabled();

    const dragHandles = screen.getAllByRole('button', {
      name: /Drag .* to reorder/i,
    });
    dragHandles.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('readOnly hides Add and delete and disables drag', () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    render(
      <EducationSection
        profile={profile}
        onProfileChange={onChange}
        readOnly
      />,
    );

    expect(
      screen.queryByRole('button', { name: /Add Education/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Remove Uni A/i }),
    ).not.toBeInTheDocument();

    const dragHandles = screen.getAllByRole('button', {
      name: /Drag .* to reorder/i,
    });
    expect(dragHandles.length).toBeGreaterThan(0);
    dragHandles.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('inline edit regression: city nullable creates minimal location when absent', async () => {
    const profile = makeProfile({
      education: [
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
    });
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<EducationSection profile={profile} onProfileChange={onChange} />);

    await user.dblClick(screen.getByLabelText('Edit City'));
    const input = screen.getByLabelText('City');
    await user.clear(input);
    await user.type(input, 'Berlin');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.education[0].location?.city).toBe('Berlin');
    expect(profile.education[0].location).toBeNull();
    expect(next.education[0].id).toBe('edu-2');
  });

  it('inline edit regression: institution updates immutably', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<EducationSection profile={profile} onProfileChange={onChange} />);

    await user.dblClick(screen.getAllByLabelText('Edit Institution')[0]);
    const input = screen.getByLabelText('Institution');
    await user.clear(input);
    await user.type(input, 'Updated Uni');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.education[0].institution).toBe('Updated Uni');
    expect(next.education[1].institution).toBe('Uni B');
    expect(profile.education[0].institution).toBe('Uni A');
    expect(next).not.toBe(profile);
  });

  it('inline edit regression: degree empty->null and startDate nullable', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<EducationSection profile={profile} onProfileChange={onChange} />);

    await user.dblClick(screen.getAllByLabelText('Edit Degree')[0]);
    const degreeInput = screen.getByLabelText('Degree');
    await user.clear(degreeInput);
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    expect(
      (onChange.mock.calls[0][0] as CandidateProfileV1).education[0].degree,
    ).toBeNull();

    onChange.mockClear();
    await user.dblClick(screen.getAllByLabelText('Edit Start date')[0]);
    const dateInput = screen.getByLabelText('Start date');
    await user.clear(dateInput);
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    expect(
      (onChange.mock.calls[0][0] as CandidateProfileV1).education[0].startDate,
    ).toBeNull();
  });

  it('preserves empty text and no credential fields, styling', () => {
    const empty = makeProfile({ education: [] });
    const { unmount } = render(
      <EducationSection profile={empty} onProfileChange={vi.fn()} />,
    );
    expect(screen.getByText('No education yet')).toBeInTheDocument();
    expect(screen.queryByText(/credential/i)).not.toBeInTheDocument();
    unmount();

    const profile = makeProfile();
    render(<EducationSection profile={profile} onProfileChange={vi.fn()} />);
    expect(
      screen.getByRole('heading', { name: 'Education' }),
    ).toBeInTheDocument();
    expect(screen.getAllByLabelText('Edit Institution')).toHaveLength(2);
    expect(screen.getAllByLabelText('Edit City')).toHaveLength(2);
    expect(screen.getAllByLabelText('Edit Start date')).toHaveLength(2);
  });

  it('add keeps dialog open when onProfileChange rejects and closes on success', async () => {
    const profile = makeProfile({ education: [] });
    const user = userEvent.setup();
    const uuid = '33333333-3333-4333-8333-333333333333';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      uuid as `${string}-${string}-${string}-${string}-${string}`,
    );
    const onChangeFail = vi.fn().mockRejectedValue(new Error('fail'));
    const { unmount } = render(
      <EducationSection profile={profile} onProfileChange={onChangeFail} />,
    );
    await user.click(screen.getByRole('button', { name: /Add Education/i }));
    await user.type(screen.getByLabelText('Institution'), 'MIT');
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    await waitFor(() => expect(onChangeFail).toHaveBeenCalledTimes(1));
    expect(
      screen.getByRole('dialog', { name: 'Add education' }),
    ).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 20));
    unmount();

    const onChangeSuccess = vi.fn().mockResolvedValue(undefined);
    render(
      <EducationSection profile={profile} onProfileChange={onChangeSuccess} />,
    );
    await user.click(screen.getByRole('button', { name: /Add Education/i }));
    await user.type(screen.getByLabelText('Institution'), 'MIT');
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    await waitFor(() => expect(onChangeSuccess).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: 'Add education' }),
      ).not.toBeInTheDocument(),
    );
  });

  it('remove keeps dialog open when onProfileChange rejects', async () => {
    const profile = makeProfile();
    const onChange = vi.fn().mockRejectedValue(new Error('fail'));
    const user = userEvent.setup();
    render(<EducationSection profile={profile} onProfileChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /Remove Uni A/i }));
    expect(
      screen.getByRole('dialog', { name: /Remove Uni A\?/i }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove' }));
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    expect(
      screen.getByRole('dialog', { name: /Remove Uni A\?/i }),
    ).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 10));
  });

  it('reorder attaches catch and handles no-op plus rejection', async () => {
    const profile = makeProfile();
    const { renderHook, act } = await import('@testing-library/react');
    const { useEducationSection } = await import('./hooks/useEducationSection');
    const onChange = vi.fn().mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useEducationSection(profile, onChange));
    let returned: unknown;
    act(() => {
      returned = result.current.handleReorder(0, 1);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    await expect(returned as Promise<void>).rejects.toThrow('fail');
    await new Promise((r) => setTimeout(r, 10));
    onChange.mockClear();
    const onChange2 = vi.fn();
    const { result: result2 } = renderHook(() =>
      useEducationSection(profile, onChange2),
    );
    act(() => result2.current.handleReorder(0, 0));
    expect(onChange2).not.toHaveBeenCalled();
  });

  it('dialog backdrop cannot cancel while pending', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <AddEducationDialog
        open
        onCancel={onCancel}
        onSubmit={vi.fn()}
        pending
        error={null}
      />,
    );
    const dialog = screen.getByRole('dialog', { name: 'Add education' });
    await user.click(dialog);
    expect(onCancel).not.toHaveBeenCalled();
    fireEvent.click(dialog);
    expect(onCancel).not.toHaveBeenCalled();
    rerender(
      <AddEducationDialog
        open
        onCancel={onCancel}
        onSubmit={vi.fn()}
        pending={false}
        error={null}
      />,
    );
    await user.click(screen.getByRole('dialog', { name: 'Add education' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('external error sync clears stale alert when prop becomes null while preserving local validation', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <AddEducationDialog
        open
        onCancel={vi.fn()}
        onSubmit={onSubmit}
        error="External error"
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('External error');
    rerender(
      <AddEducationDialog
        open
        onCancel={vi.fn()}
        onSubmit={onSubmit}
        error={null}
      />,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Institution is required',
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('hook delegates immutable updates and EducationItem is render-only', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const { renderHook, act } = await import('@testing-library/react');
    const { useEducationSection } = await import('./hooks/useEducationSection');
    const { result } = renderHook(() => useEducationSection(profile, onChange));
    expect(typeof result.current.updateInstitution).toBe('function');
    expect(typeof result.current.updateDegree).toBe('function');
    expect(typeof result.current.updateFieldOfStudy).toBe('function');
    expect(typeof result.current.updateCity).toBe('function');
    expect(typeof result.current.updateRegion).toBe('function');
    expect(typeof result.current.updateCountryCode).toBe('function');
    expect(typeof result.current.updateStartDate).toBe('function');
    expect(typeof result.current.updateEndDate).toBe('function');

    act(() => result.current.updateInstitution('edu-1', 'New Uni'));
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    let next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.education[0].institution).toBe('New Uni');
    expect(profile.education[0].institution).toBe('Uni A');
    onChange.mockClear();

    act(() => result.current.updateDegree('edu-1', '   '));
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.education[0].degree).toBeNull();

    onChange.mockClear();
    act(() => result.current.updateCity('edu-2', 'Berlin'));
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.education.find((e) => e.id === 'edu-2')?.location?.city).toBe(
      'Berlin',
    );

    const item = profile.education[0];
    const callbacks = {
      onInstitutionSubmit: vi.fn(),
      onDegreeSubmit: vi.fn(),
      onFieldOfStudySubmit: vi.fn(),
      onCitySubmit: vi.fn(),
      onRegionSubmit: vi.fn(),
      onCountryCodeSubmit: vi.fn(),
      onStartDateSubmit: vi.fn(),
      onEndDateSubmit: vi.fn(),
    };
    render(<EducationItem item={item} {...callbacks} />);
    expect(screen.getByLabelText('Edit Institution')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit City')).toBeInTheDocument();
    expect(screen.queryByText(/credential/i)).not.toBeInTheDocument();
  });
});
