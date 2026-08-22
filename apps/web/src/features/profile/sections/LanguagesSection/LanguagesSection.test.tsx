import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { components } from '@talentor/contracts';
import LanguagesSection from './index';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];

vi.mock('@/components/ui/select', () => {
  let currentOnValueChange: ((v: string) => void) | undefined;
  return {
    Select: ({
      children,
      onValueChange,
      value,
      disabled,
    }: {
      children: React.ReactNode;
      onValueChange?: (v: string) => void;
      value?: string;
      disabled?: boolean;
    }) => {
      currentOnValueChange = onValueChange;
      return (
        <div
          data-testid="select-root"
          data-value={value ?? ''}
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
    languages: [
      { id: 'lang-1', language: 'English', proficiency: 'C1' },
      { id: 'lang-2', language: 'Spanish', proficiency: 'native' },
    ],
    education: [],
    projects: [],
    certifications: [],
  } as unknown as CandidateProfileV1;
  return {
    ...base,
    ...overrides,
    personalInfo: { ...base.personalInfo, ...(overrides?.personalInfo ?? {}) },
    languages: overrides?.languages ?? base.languages,
  } as CandidateProfileV1;
}

describe('LanguagesSection', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders empty state and Add button', () => {
    const profile = makeProfile({ languages: [] });
    render(<LanguagesSection profile={profile} onProfileChange={vi.fn()} />);
    expect(screen.getByText('No languages yet')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Languages' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Add Languages/i }),
    ).toBeInTheDocument();
  });

  it('valid add creates UUID payload with proficiency enum and no extra fields', async () => {
    const profile = makeProfile({ languages: [] });
    const onChange = vi.fn();
    const uuid = '22222222-2222-4222-8222-222222222222';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      uuid as `${string}-${string}-${string}-${string}-${string}`,
    );
    const user = userEvent.setup();
    render(<LanguagesSection profile={profile} onProfileChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /Add Languages/i }));
    expect(
      screen.getByRole('dialog', { name: 'Add language' }),
    ).toBeInTheDocument();

    const langInput = screen.getByLabelText('Language');
    await user.type(langInput, 'German');

    // proficiency select: our mock renders options as clickable divs
    const trigger = screen.getByLabelText('Proficiency');
    expect(trigger).toBeInTheDocument();
    // click option B2
    const option = await screen.findByRole('option', { name: 'B2' });
    await user.click(option);

    await user.click(screen.getByRole('button', { name: /^Add$/i }));

    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.languages).toHaveLength(1);
    const added = next.languages[0];
    expect(added.id).toBe(uuid);
    expect(added.language).toBe('German');
    expect(added.proficiency).toBe('B2');
    expect(Object.keys(added).sort()).toEqual(
      ['id', 'language', 'proficiency'].sort(),
    );
    expect(next).not.toBe(profile);
  });

  it('validation prevents save when required fields missing', async () => {
    const profile = makeProfile({ languages: [] });
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<LanguagesSection profile={profile} onProfileChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /Add Languages/i }));
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(onChange).not.toHaveBeenCalled();
    expect(
      await screen.findByText('Language and proficiency are required'),
    ).toBeInTheDocument();

    // fill only language
    await user.type(screen.getByLabelText('Language'), 'French');
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(onChange).not.toHaveBeenCalled();

    // fill proficiency whitespace? Our mock requires value, so empty proficiency still fails
  });

  it('reorder persists array order', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const { reorder } = await import('../../collections');
    const reordered = reorder(profile.languages, 0, 1);
    expect(reordered[0].id).toBe('lang-2');
    expect(reordered[1].id).toBe('lang-1');

    const { renderHook, act } = await import('@testing-library/react');
    const { useLanguagesSection } = await import('./hooks/useLanguagesSection');
    const { result } = renderHook(() => useLanguagesSection(profile, onChange));
    act(() => result.current.handleReorder(0, 1));
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.languages[0].id).toBe('lang-2');
    expect(next.languages[1].id).toBe('lang-1');
    expect(next.languages).not.toBe(profile.languages);
  });

  it('remove simple utility cleans languages array', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<LanguagesSection profile={profile} onProfileChange={onChange} />);

    const deleteBtn = screen.getByRole('button', { name: /Remove English/i });
    await user.click(deleteBtn);

    expect(
      screen.getByRole('dialog', { name: /Remove English\?/i }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove' }));

    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.languages.map((l) => l.id)).toEqual(['lang-2']);
    expect(next.skills).toBe(profile.skills);
    expect(next.experience).toBe(profile.experience);
    expect(profile.languages).toHaveLength(2);
  });

  it('pending disables Add and delete and drag', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    render(
      <LanguagesSection profile={profile} onProfileChange={onChange} pending />,
    );

    const addBtn = screen.getByRole('button', { name: /Add Languages/i });
    expect(addBtn).toBeDisabled();
    expect(addBtn).toHaveAttribute('aria-busy', 'true');

    const deleteBtn = screen.getByRole('button', { name: /Remove English/i });
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
      <LanguagesSection
        profile={profile}
        onProfileChange={onChange}
        readOnly
      />,
    );

    expect(
      screen.queryByRole('button', { name: /Add Languages/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Remove English/i }),
    ).not.toBeInTheDocument();

    const dragHandles = screen.getAllByRole('button', {
      name: /Drag .* to reorder/i,
    });
    expect(dragHandles.length).toBeGreaterThan(0);
    dragHandles.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('inline edit regression: proficiency select retains enum and preserves id', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<LanguagesSection profile={profile} onProfileChange={onChange} />);

    await user.dblClick(screen.getAllByLabelText('Edit Proficiency')[0]);
    const trigger = await screen.findByLabelText('Proficiency');
    expect(trigger).toBeInTheDocument();
    const option = await screen.findByRole('option', { name: 'Native' });
    await user.click(option);

    await waitFor(() => expect(onChange).toHaveBeenCalled());
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.languages[0].proficiency).toBe('native');
    expect(next.languages[0].id).toBe(profile.languages[0].id);
    expect(next.languages[0].language).toBe(profile.languages[0].language);
    expect(next).not.toBe(profile);
  });

  it('inline edit language field updates without affecting other languages', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<LanguagesSection profile={profile} onProfileChange={onChange} />);

    await user.dblClick(screen.getAllByLabelText('Edit Language')[0]);
    const input = screen.getByLabelText('Language');
    await user.clear(input);
    await user.type(input, 'Deutsch');
    await user.keyboard('{Enter}');

    await waitFor(() => expect(onChange).toHaveBeenCalled());
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.languages[0].language).toBe('Deutsch');
    expect(next.languages[1].language).toBe('Spanish');
    expect(next.languages[0].id).toBe('lang-1');
  });

  it('preserves empty text and styling, no forbidden fields', () => {
    const empty = makeProfile({ languages: [] });
    const { unmount } = render(
      <LanguagesSection profile={empty} onProfileChange={vi.fn()} />,
    );
    expect(screen.getByText('No languages yet')).toBeInTheDocument();
    expect(screen.queryByText(/aliases/i)).not.toBeInTheDocument();
    unmount();

    const profile = makeProfile();
    render(<LanguagesSection profile={profile} onProfileChange={vi.fn()} />);
    expect(
      screen.getByRole('heading', { name: 'Languages' }),
    ).toBeInTheDocument();
    expect(screen.getAllByLabelText('Edit Language').length).toBe(2);
    expect(screen.getAllByLabelText('Edit Proficiency').length).toBe(2);
  });
});
