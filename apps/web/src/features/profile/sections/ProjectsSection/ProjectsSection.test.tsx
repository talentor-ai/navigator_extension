import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { components } from '@talentor/contracts';
import { renderHook, act } from '@testing-library/react';

import ProjectsSection from './index';
import { useProjectEditor } from './hooks/useProjectEditor';

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
      phone: null,
      location: null,
      links: [],
    },
    defaultRole: null,
    baseSummary: null,
    experience: [],
    skills: [
      {
        id: 'a1b2c3d4-e5f6-4a7b-8c9d-111111111111',
        name: 'React',
        category: 'Frontend',
        yearsOfExperience: null,
        lastUsed: null,
        aliases: null,
        evidenceRefs: ['60000000-0000-4000-a000-000000000006', 'proj-other'],
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
        role: 'Lead',
        description: 'Desc',
        startDate: '2021-01',
        endDate: null,
        url: 'https://example.com',
        repository: 'https://github.com/repo',
        achievements: ['proj ach'],
        skillRefs: ['a1b2c3d4-e5f6-4a7b-8c9d-111111111111'],
      },
      {
        id: '60000000-0000-4000-a000-000000000007',
        name: 'Second',
        role: null,
        description: 'Desc2',
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
    projects: overrides?.projects ?? base.projects,
    skills: overrides?.skills ?? base.skills,
    experience: overrides?.experience ?? base.experience,
    personalInfo: { ...base.personalInfo, ...(overrides?.personalInfo ?? {}) },
  } as CandidateProfileV1;
}

describe('ProjectsSection – Wave 3A', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('renders header, Add button and drag handles', () => {
    const profile = makeProfile();
    render(<ProjectsSection profile={profile} onProfileChange={vi.fn()} />);
    expect(
      screen.getByRole('heading', { name: 'Projects' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Add Projects/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /Drag to reorder/i }),
    ).toHaveLength(2);
    expect(
      screen.getAllByRole('button', { name: /Remove project/i }),
    ).toHaveLength(2);
  });

  it('valid add appends project with minimal required fields', async () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    const uuid = '99999999-9999-4000-a000-000000000999';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(uuid as any);

    render(
      <ProjectsSection profile={profile} onProfileChange={onProfileChange} />,
    );
    await user.click(screen.getByRole('button', { name: /Add Projects/i }));
    expect(
      screen.getByRole('dialog', { name: 'Add project' }),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText('Project name'), 'NewProj');
    await user.type(screen.getByLabelText('Project description'), 'New desc');

    await user.click(screen.getByRole('button', { name: /^Add$/ }));
    await waitFor(() => expect(onProfileChange).toHaveBeenCalledTimes(1));
    const next = onProfileChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.projects).toHaveLength(3);
    const added = next.projects[2];
    expect(added.id).toBe(uuid);
    expect(added.name).toBe('NewProj');
    expect(added.description).toBe('New desc');
    // contract-valid: no extra required, skillRefs/achievements may be absent or empty but valid
    expect(profile.projects).toHaveLength(2);
    expect(next).not.toBe(profile);
  });

  it('invalid add missing required does not save', async () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ProjectsSection profile={profile} onProfileChange={onProfileChange} />,
    );
    await user.click(screen.getByRole('button', { name: /Add Projects/i }));
    await user.click(screen.getByRole('button', { name: /^Add$/ }));
    expect(onProfileChange).not.toHaveBeenCalled();
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Project name'), 'OnlyName');
    await user.click(screen.getByRole('button', { name: /^Add$/ }));
    expect(onProfileChange).not.toHaveBeenCalled();
  });

  it('remove confirmation cascades evidenceRefs and pending', async () => {
    const profile = makeProfile();
    // pending false first
    const onProfileChange = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(
      <ProjectsSection profile={profile} onProfileChange={onProfileChange} />,
    );
    await user.click(
      screen.getAllByRole('button', { name: /Remove project/i })[0],
    );
    expect(
      screen.getByRole('dialog', { name: 'Remove project?' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove' }));
    await waitFor(() => expect(onProfileChange).toHaveBeenCalledTimes(1));
    const next = onProfileChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.projects.map((p) => p.id)).toEqual([
      '60000000-0000-4000-a000-000000000007',
    ]);
    const skill1 = next.skills.find(
      (s) => s.id === 'a1b2c3d4-e5f6-4a7b-8c9d-111111111111',
    )!;
    expect(skill1.evidenceRefs).toEqual(['proj-other']);
    expect(next.skills[1].evidenceRefs).toBeNull();
  });

  it('remove dialog shows pending while shared pending', async () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <ProjectsSection
        profile={profile}
        onProfileChange={onProfileChange}
        pending={false}
      />,
    );
    await user.click(
      screen.getAllByRole('button', { name: /Remove project/i })[0],
    );
    expect(screen.getByRole('button', { name: 'Remove' })).toBeEnabled();
    rerender(
      <ProjectsSection
        profile={profile}
        onProfileChange={onProfileChange}
        pending={true}
      />,
    );
    expect(screen.getByRole('button', { name: 'Removing...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('remove cancel does not call onProfileChange', async () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ProjectsSection profile={profile} onProfileChange={onProfileChange} />,
    );
    await user.click(
      screen.getAllByRole('button', { name: /Remove project/i })[0],
    );
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onProfileChange).not.toHaveBeenCalled();
  });

  it('pending disables Add, drag, delete', () => {
    const profile = makeProfile();
    render(
      <ProjectsSection profile={profile} onProfileChange={vi.fn()} pending />,
    );
    expect(
      screen.getByRole('button', { name: /Add Projects/i }),
    ).toBeDisabled();
    expect(
      screen.getAllByRole('button', { name: /Drag to reorder/i })[0],
    ).toBeDisabled();
    expect(
      screen.getAllByRole('button', { name: /Remove project/i })[0],
    ).toBeDisabled();
  });

  it('readOnly hides Add/delete and disables drag', async () => {
    const profile = makeProfile();
    render(
      <ProjectsSection profile={profile} onProfileChange={vi.fn()} readOnly />,
    );
    expect(
      screen.queryByRole('button', { name: /Add Projects/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Remove project/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /Drag to reorder/i })[0],
    ).toBeDisabled();
  });

  it('inline edit regression – project name immutable', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ProjectsSection profile={profile} onProfileChange={onChange} />);
    await user.dblClick(screen.getAllByLabelText('Edit Project name')[0]);
    const input = screen.getByLabelText('Project name');
    await user.clear(input);
    await user.type(input, 'Updated');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.projects[0].name).toBe('Updated');
    expect(profile.projects[0].name).toBe('Proj');
    expect(next).not.toBe(profile);
  });

  it('reorder via hook immutable', () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn();
    const { result } = renderHook(() =>
      useProjectEditor(profile, onProfileChange),
    );
    act(() => result.current.handleReorder(0, 1));
    expect(onProfileChange).toHaveBeenCalledTimes(1);
    const next = onProfileChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.projects.map((p) => p.id)).toEqual([
      '60000000-0000-4000-a000-000000000007',
      '60000000-0000-4000-a000-000000000006',
    ]);
    expect(profile.projects[0].id).toBe('60000000-0000-4000-a000-000000000006');
  });

  it('add dialog stays open when onProfileChange rejects', async () => {
    const profile = makeProfile();
    const onProfileChange = vi
      .fn()
      .mockImplementation(() => Promise.reject(new Error('fail')));
    const user = userEvent.setup();
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      'aaaaaaaa-aaaa-4000-a000-000000000aaa' as any,
    );
    render(
      <ProjectsSection profile={profile} onProfileChange={onProfileChange} />,
    );
    await user.click(screen.getByRole('button', { name: /Add Projects/i }));
    await user.type(screen.getByLabelText('Project name'), 'Name');
    await user.type(screen.getByLabelText('Project description'), 'Desc');
    await user.click(screen.getByRole('button', { name: /^Add$/ }));
    await waitFor(() => expect(onProfileChange).toHaveBeenCalled());
    expect(
      screen.getByRole('dialog', { name: 'Add project' }),
    ).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 20));
  });

  it('empty state preserves text', () => {
    const empty = makeProfile({ projects: [] });
    render(<ProjectsSection profile={empty} onProfileChange={vi.fn()} />);
    expect(screen.getByText('No projects yet')).toBeInTheDocument();
  });

  it('add dialog backdrop cannot cancel while pending', async () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      'bbbbbbbb-bbbb-4000-a000-000000000bbb' as any,
    );
    const { rerender } = render(
      <ProjectsSection
        profile={profile}
        onProfileChange={onProfileChange}
        pending={false}
      />,
    );
    await user.click(screen.getByRole('button', { name: /Add Projects/i }));
    const dialog = screen.getByRole('dialog', { name: 'Add project' });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
    rerender(
      <ProjectsSection
        profile={profile}
        onProfileChange={onProfileChange}
        pending
      />,
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Adding...' })).toBeDisabled();
    await user.click(dialog);
    expect(
      screen.getByRole('dialog', { name: 'Add project' }),
    ).toBeInTheDocument();
    rerender(
      <ProjectsSection
        profile={profile}
        onProfileChange={onProfileChange}
        pending={false}
      />,
    );
    await user.click(screen.getByRole('dialog', { name: 'Add project' }));
    expect(
      screen.queryByRole('dialog', { name: 'Add project' }),
    ).not.toBeInTheDocument();
  });

  it('remove stays open when onProfileChange rejects', async () => {
    const profile = makeProfile();
    const onProfileChange = vi
      .fn()
      .mockImplementation(() => Promise.reject(new Error('fail')));
    const user = userEvent.setup();
    render(
      <ProjectsSection profile={profile} onProfileChange={onProfileChange} />,
    );
    await user.click(
      screen.getAllByRole('button', { name: /Remove project/i })[0],
    );
    expect(
      screen.getByRole('dialog', { name: 'Remove project?' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove' }));
    await waitFor(() => expect(onProfileChange).toHaveBeenCalledTimes(1));
    expect(
      screen.getByRole('dialog', { name: 'Remove project?' }),
    ).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 20));
  });

  it('remove guard does not call onProfileChange when id not found', () => {
    const profile = makeProfile();
    const onProfileChange = vi.fn();
    const { result } = renderHook(() =>
      useProjectEditor(profile, onProfileChange),
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
      useProjectEditor(profile, onProfileChange),
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
      useProjectEditor(profile, onProfileChange),
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
    onProfileChange.mockClear();
    act(() => result.current.handleReorder(1, 1));
    expect(onProfileChange).not.toHaveBeenCalled();
  });
});
