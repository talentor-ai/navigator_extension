import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { components } from '@talentor/contracts';
import SkillsSection from './index';

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
        yearsOfExperience: 5,
        lastUsed: '2024-01',
        evidenceRefs: null,
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
    ],
    languages: [],
    education: [],
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
        skillRefs: ['skill-1', 'skill-2'],
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
    certifications: [],
  } as unknown as CandidateProfileV1;
  return {
    ...base,
    ...overrides,
    personalInfo: { ...base.personalInfo, ...(overrides?.personalInfo ?? {}) },
    experience: overrides?.experience ?? base.experience,
    skills: overrides?.skills ?? base.skills,
    projects: overrides?.projects ?? base.projects,
  } as CandidateProfileV1;
}

describe('SkillsSection', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders empty state and Add button', () => {
    const profile = makeProfile({ skills: [], experience: [], projects: [] });
    render(<SkillsSection profile={profile} onProfileChange={vi.fn()} />);
    expect(screen.getByText('No skills yet')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Add Skills/i }),
    ).toBeInTheDocument();
  });

  it('valid add creates UUID payload with only name/category and no speculative fields', async () => {
    const profile = makeProfile({ skills: [] });
    const onChange = vi.fn();
    const uuid = '11111111-1111-4111-8111-111111111111';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      uuid as `${string}-${string}-${string}-${string}-${string}`,
    );
    const user = userEvent.setup();
    render(<SkillsSection profile={profile} onProfileChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /Add Skills/i }));
    expect(
      screen.getByRole('dialog', { name: 'Add skill' }),
    ).toBeInTheDocument();

    const nameInput = screen.getByLabelText('Name');
    const categoryInput = screen.getByLabelText('Category');
    await user.type(nameInput, 'TypeScript');
    await user.type(categoryInput, 'Language');

    await user.click(screen.getByRole('button', { name: /^Add$/i }));

    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.skills).toHaveLength(1);
    const added = next.skills[0];
    expect(added.id).toBe(uuid);
    expect(added.name).toBe('TypeScript');
    expect(added.category).toBe('Language');
    // no speculative fields should be present as extra keys beyond allowed
    expect(Object.keys(added).sort()).toEqual(
      ['category', 'id', 'name'].sort(),
    );
    expect(next).not.toBe(profile);
    expect(profile.skills).toHaveLength(0);
  });

  it('validation prevents save when required fields missing', async () => {
    const profile = makeProfile({ skills: [] });
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SkillsSection profile={profile} onProfileChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /Add Skills/i }));

    // leave empty and try to add
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(onChange).not.toHaveBeenCalled();
    expect(
      await screen.findByText('Name and category are required'),
    ).toBeInTheDocument();

    // fill only name
    await user.type(screen.getByLabelText('Name'), 'Go');
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(onChange).not.toHaveBeenCalled();

    // fill category with whitespace only -> still required
    const cat = screen.getByLabelText('Category');
    await user.type(cat, '   ');
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('reorder persists array order via handler', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    // We test hook reorder directly via component's onReorder by invoking the underlying reorder utility path
    // Render and trigger reorder via the hook's exposed handler indirectly by checking that reorder utility is used
    // Simulate drag reorder by calling onProfileChange with reordered array – verify it matches reorder result
    // Use the component's internal handleReorder by directly testing the reorder function integration
    const { reorder } = await import('../../collections');
    const reordered = reorder(profile.skills, 0, 1);
    expect(reordered[0].id).toBe('skill-2');
    expect(reordered[1].id).toBe('skill-1');

    // Now verify component's handleReorder would produce same result when called
    // We render and manually trigger the onReorder via the SortableCollection's DndContext is internal,
    // so we test the hook directly
    const { renderHook, act } = await import('@testing-library/react');
    const { useSkillsSection } = await import('./hooks/useSkillsSection');
    const { result } = renderHook(() => useSkillsSection(profile, onChange));
    act(() => result.current.handleReorder(0, 1));
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.skills[0].id).toBe('skill-2');
    expect(next.skills[1].id).toBe('skill-1');
    expect(next.skills).not.toBe(profile.skills);
    expect(profile.skills[0].id).toBe('skill-1');
  });

  it('remove cascades skillRefs in experience and projects preserving null', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SkillsSection profile={profile} onProfileChange={onChange} />);

    // two skills rendered, each has delete button
    const deleteButtons = screen.getAllByRole('button', {
      name: /Remove React/i,
    });
    expect(deleteButtons).toHaveLength(1);
    await user.click(deleteButtons[0]);

    // confirm dialog appears
    expect(
      screen.getByRole('dialog', { name: /Remove React\?/i }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove' }));

    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.skills.map((s) => s.id)).toEqual(['skill-2']);
    // cascade: exp-1 had ['skill-1','skill-2'] -> now ['skill-2']
    expect(next.experience.find((e) => e.id === 'exp-1')?.skillRefs).toEqual([
      'skill-2',
    ]);
    // exp-2 unchanged
    expect(next.experience.find((e) => e.id === 'exp-2')?.skillRefs).toEqual([
      'skill-2',
    ]);
    // proj-1 had ['skill-1','skill-2'] -> ['skill-2']
    expect(next.projects.find((p) => p.id === 'proj-1')?.skillRefs).toEqual([
      'skill-2',
    ]);
    // proj-2 had null -> remains null (preserve null)
    expect(next.projects.find((p) => p.id === 'proj-2')?.skillRefs).toBeNull();
    expect(profile.skills).toHaveLength(2);
    expect(
      profile.projects.find((p) => p.id === 'proj-2')?.skillRefs,
    ).toBeNull();
  });

  it('pending disables Add and delete and drag', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    render(
      <SkillsSection profile={profile} onProfileChange={onChange} pending />,
    );

    const addBtn = screen.getByRole('button', { name: /Add Skills/i });
    expect(addBtn).toBeDisabled();
    expect(addBtn).toHaveAttribute('aria-busy', 'true');

    // delete buttons disabled
    const deleteBtn = screen.getByRole('button', { name: /Remove React/i });
    expect(deleteBtn).toBeDisabled();

    // drag handles disabled
    const dragHandles = screen.getAllByRole('button', {
      name: /Drag .* to reorder/i,
    });
    dragHandles.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('readOnly hides Add and delete and disables drag', () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    render(
      <SkillsSection profile={profile} onProfileChange={onChange} readOnly />,
    );

    expect(
      screen.queryByRole('button', { name: /Add Skills/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Remove React/i }),
    ).not.toBeInTheDocument();

    const dragHandles = screen.getAllByRole('button', {
      name: /Drag .* to reorder/i,
    });
    expect(dragHandles.length).toBeGreaterThan(0);
    dragHandles.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('inline edit regression: years empty->null', async () => {
    const profile = makeProfile({
      skills: [
        {
          id: 'skill-1',
          name: 'React',
          category: 'Frontend',
          yearsOfExperience: 5,
          lastUsed: '2024-01',
          aliases: null,
          evidenceRefs: null,
        } as unknown as components['schemas']['Skill'],
      ],
      experience: [],
      projects: [],
    });
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SkillsSection profile={profile} onProfileChange={onChange} />);
    await user.dblClick(screen.getByLabelText('Edit Years of experience'));
    const input = screen.getByLabelText(
      'Years of experience',
    ) as HTMLInputElement;
    await user.clear(input);
    fireEvent.submit(input.closest('form')!);
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    expect(
      (onChange.mock.calls[0][0] as CandidateProfileV1).skills[0]
        .yearsOfExperience,
    ).toBeNull();
  });

  it('inline edit regression: invalid negative years does not save', async () => {
    const profile = makeProfile({
      skills: [
        {
          id: 'skill-1',
          name: 'React',
          category: 'Frontend',
          yearsOfExperience: 5,
          lastUsed: '2024-01',
          aliases: null,
          evidenceRefs: null,
        } as unknown as components['schemas']['Skill'],
      ],
      experience: [],
      projects: [],
    });
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SkillsSection profile={profile} onProfileChange={onChange} />);
    await user.dblClick(screen.getByLabelText('Edit Years of experience'));
    const input = screen.getByLabelText(
      'Years of experience',
    ) as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '-5');
    fireEvent.submit(input.closest('form')!);
    await new Promise((r) => setTimeout(r, 30));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('inline edit regression: valid zero years saves as number', async () => {
    const profile = makeProfile({
      skills: [
        {
          id: 'skill-1',
          name: 'React',
          category: 'Frontend',
          yearsOfExperience: 5,
          lastUsed: '2024-01',
          aliases: null,
          evidenceRefs: null,
        } as unknown as components['schemas']['Skill'],
      ],
      experience: [],
      projects: [],
    });
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SkillsSection profile={profile} onProfileChange={onChange} />);
    await user.dblClick(screen.getByLabelText('Edit Years of experience'));
    const input = screen.getByLabelText(
      'Years of experience',
    ) as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '0');
    fireEvent.submit(input.closest('form')!);
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(
      (onChange.mock.calls[0][0] as CandidateProfileV1).skills[0]
        .yearsOfExperience,
    ).toBe(0);
  });

  it('inline edit preserves styling and empty text, no forbidden fields', () => {
    const empty = makeProfile({ skills: [], experience: [], projects: [] });
    const { unmount } = render(
      <SkillsSection profile={empty} onProfileChange={vi.fn()} />,
    );
    expect(screen.getByText('No skills yet')).toBeInTheDocument();
    expect(screen.queryByText(/aliases/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/evidence/i)).not.toBeInTheDocument();
    unmount();

    const profile2 = makeProfile();
    render(<SkillsSection profile={profile2} onProfileChange={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument();
    expect(screen.getAllByLabelText('Edit Skill name')).toHaveLength(2);
    expect(screen.getAllByLabelText('Edit Category')).toHaveLength(2);
  });
});
