import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { components } from '@talentor/contracts';
import CertificationsSection from './index';
import { AddCertificationDialog } from './components/AddCertificationDialog';
import { CertificationItem } from './components/CertificationItem';

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
    education: [],
    projects: [],
    certifications: [
      {
        id: 'cert-1',
        name: 'Cert A',
        issuer: 'Issuer A',
        issueDate: '2020-01',
        expirationDate: null,
        credentialId: 'CRED-123',
        credentialUrl: 'https://cred.example',
      },
      {
        id: 'cert-2',
        name: 'Cert B',
        issuer: 'Issuer B',
        issueDate: null,
        expirationDate: '2025-01',
        credentialId: null,
        credentialUrl: null,
      },
    ],
  } as unknown as CandidateProfileV1;
  return {
    ...base,
    ...overrides,
    certifications: overrides?.certifications ?? base.certifications,
  } as CandidateProfileV1;
}

describe('CertificationsSection', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders empty state and Add button', () => {
    const profile = makeProfile({ certifications: [] });
    render(
      <CertificationsSection profile={profile} onProfileChange={vi.fn()} />,
    );
    expect(screen.getByText('No certifications yet')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Certifications' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Add Certifications/i }),
    ).toBeInTheDocument();
  });

  it('valid add creates UUID payload with only name and issuer minimal', async () => {
    const profile = makeProfile({ certifications: [] });
    const onChange = vi.fn();
    const uuid = '44444444-4444-4444-8444-444444444444';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      uuid as `${string}-${string}-${string}-${string}-${string}`,
    );
    const user = userEvent.setup();
    render(
      <CertificationsSection profile={profile} onProfileChange={onChange} />,
    );

    await user.click(
      screen.getByRole('button', { name: /Add Certifications/i }),
    );
    expect(
      screen.getByRole('dialog', { name: 'Add certification' }),
    ).toBeInTheDocument();

    const nameInput = screen.getByLabelText('Name');
    const issuerInput = screen.getByLabelText('Issuer');
    await user.type(nameInput, 'AWS Certified');
    await user.type(issuerInput, 'Amazon');

    await user.click(screen.getByRole('button', { name: /^Add$/i }));

    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.certifications).toHaveLength(1);
    const added = next.certifications[0];
    expect(added.id).toBe(uuid);
    expect(added.name).toBe('AWS Certified');
    expect(added.issuer).toBe('Amazon');
    expect(Object.keys(added).sort()).toEqual(['id', 'issuer', 'name'].sort());
    expect(next).not.toBe(profile);
    expect(profile.certifications).toHaveLength(0);
  });

  it('validation prevents save when required fields missing', async () => {
    const profile = makeProfile({ certifications: [] });
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <CertificationsSection profile={profile} onProfileChange={onChange} />,
    );

    await user.click(
      screen.getByRole('button', { name: /Add Certifications/i }),
    );
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(onChange).not.toHaveBeenCalled();
    expect(
      await screen.findByText('Name and issuer are required'),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText('Name'), 'OnlyName');
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(onChange).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText('Issuer'), '   ');
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(onChange).not.toHaveBeenCalled();

    await user.clear(screen.getByLabelText('Name'));
    await user.type(screen.getByLabelText('Name'), '   ');
    await user.clear(screen.getByLabelText('Issuer'));
    await user.type(screen.getByLabelText('Issuer'), 'Issuer');
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('reorder persists array order via handler', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const { reorder } = await import('../../collections');
    const reordered = reorder(profile.certifications, 0, 1);
    expect(reordered[0].id).toBe('cert-2');
    expect(reordered[1].id).toBe('cert-1');

    const { renderHook, act } = await import('@testing-library/react');
    const { useCertificationsSection } =
      await import('./hooks/useCertificationsSection');
    const { result } = renderHook(() =>
      useCertificationsSection(profile, onChange),
    );
    act(() => result.current.handleReorder(0, 1));
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.certifications[0].id).toBe('cert-2');
    expect(next.certifications[1].id).toBe('cert-1');
    expect(next.certifications).not.toBe(profile.certifications);
    expect(profile.certifications[0].id).toBe('cert-1');
  });

  it('remove confirmed cleans certifications preserving other arrays', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <CertificationsSection profile={profile} onProfileChange={onChange} />,
    );

    const deleteBtn = screen.getByRole('button', { name: /Remove Cert A/i });
    await user.click(deleteBtn);

    expect(
      screen.getByRole('dialog', { name: /Remove Cert A\?/i }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove' }));

    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.certifications.map((c) => c.id)).toEqual(['cert-2']);
    expect(next.skills).toBe(profile.skills);
    expect(profile.certifications).toHaveLength(2);
  });

  it('cancel remove does not call onProfileChange', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <CertificationsSection profile={profile} onProfileChange={onChange} />,
    );
    await user.click(screen.getByRole('button', { name: /Remove Cert A/i }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('pending disables Add and delete and drag', () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    render(
      <CertificationsSection
        profile={profile}
        onProfileChange={onChange}
        pending
      />,
    );

    const addBtn = screen.getByRole('button', {
      name: /Add Certifications/i,
    });
    expect(addBtn).toBeDisabled();
    expect(addBtn).toHaveAttribute('aria-busy', 'true');

    const deleteBtn = screen.getByRole('button', { name: /Remove Cert A/i });
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
      <CertificationsSection
        profile={profile}
        onProfileChange={onChange}
        readOnly
      />,
    );

    expect(
      screen.queryByRole('button', { name: /Add Certifications/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Remove Cert A/i }),
    ).not.toBeInTheDocument();

    const dragHandles = screen.getAllByRole('button', {
      name: /Drag .* to reorder/i,
    });
    expect(dragHandles.length).toBeGreaterThan(0);
    dragHandles.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('inline edit regression: name and issuer immutable', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <CertificationsSection profile={profile} onProfileChange={onChange} />,
    );

    await user.dblClick(screen.getAllByLabelText('Edit Certification name')[0]);
    const nameInput = screen.getByLabelText('Certification name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Cert');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    let next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.certifications[0].name).toBe('Updated Cert');
    expect(profile.certifications[0].name).toBe('Cert A');
    expect(next.certifications[1].name).toBe('Cert B');
    expect(next).not.toBe(profile);

    onChange.mockClear();
    await user.dblClick(screen.getAllByLabelText('Edit Issuer')[0]);
    const issuerInput = screen.getByLabelText('Issuer');
    await user.clear(issuerInput);
    await user.type(issuerInput, 'New Issuer');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.certifications[0].issuer).toBe('New Issuer');
  });

  it('inline edit regression: issueDate nullable handling and styling', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <CertificationsSection profile={profile} onProfileChange={onChange} />,
    );

    await user.dblClick(screen.getAllByLabelText('Edit Issue date')[0]);
    const input = screen.getByLabelText('Issue date');
    await user.clear(input);
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    expect(
      (onChange.mock.calls[0][0] as CandidateProfileV1).certifications[0]
        .issueDate,
    ).toBeNull();

    onChange.mockClear();
    await user.dblClick(screen.getAllByLabelText('Edit Expiration date')[1]);
    const expInput = screen.getByLabelText('Expiration date');
    await user.clear(expInput);
    await user.type(expInput, '2026-01');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    expect(
      (onChange.mock.calls[0][0] as CandidateProfileV1).certifications[1]
        .expirationDate,
    ).toBe('2026-01');
  });

  it('forbidden credential fields not rendered', () => {
    const profile = makeProfile();
    render(
      <CertificationsSection profile={profile} onProfileChange={vi.fn()} />,
    );
    expect(screen.queryByLabelText('Credential ID')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Credential URL')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('CredentialId')).not.toBeInTheDocument();
    expect(screen.queryByText(/credential/i)).not.toBeInTheDocument();
  });

  it('preserves empty text and heading, no extra styling break', () => {
    const empty = makeProfile({ certifications: [] });
    const { unmount } = render(
      <CertificationsSection profile={empty} onProfileChange={vi.fn()} />,
    );
    expect(screen.getByText('No certifications yet')).toBeInTheDocument();
    unmount();

    const profile = makeProfile();
    render(
      <CertificationsSection profile={profile} onProfileChange={vi.fn()} />,
    );
    expect(
      screen.getByRole('heading', { name: 'Certifications' }),
    ).toBeInTheDocument();
    expect(screen.getAllByLabelText('Edit Certification name')).toHaveLength(2);
    expect(screen.getAllByLabelText('Edit Issuer')).toHaveLength(2);
    expect(screen.getAllByLabelText('Edit Issue date')).toHaveLength(2);
  });

  it('add keeps dialog open when onProfileChange rejects and closes on success', async () => {
    const profile = makeProfile({ certifications: [] });
    const user = userEvent.setup();
    const uuid = '44444444-4444-4444-8444-444444444444';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      uuid as `${string}-${string}-${string}-${string}-${string}`,
    );
    const onChangeFail = vi.fn().mockRejectedValue(new Error('fail'));
    const { unmount } = render(
      <CertificationsSection
        profile={profile}
        onProfileChange={onChangeFail}
      />,
    );
    await user.click(
      screen.getByRole('button', { name: /Add Certifications/i }),
    );
    await user.type(screen.getByLabelText('Name'), 'AWS Certified');
    await user.type(screen.getByLabelText('Issuer'), 'Amazon');
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    await waitFor(() => expect(onChangeFail).toHaveBeenCalledTimes(1));
    expect(
      screen.getByRole('dialog', { name: 'Add certification' }),
    ).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 20));
    unmount();

    const onChangeSuccess = vi.fn().mockResolvedValue(undefined);
    render(
      <CertificationsSection
        profile={profile}
        onProfileChange={onChangeSuccess}
      />,
    );
    await user.click(
      screen.getByRole('button', { name: /Add Certifications/i }),
    );
    await user.type(screen.getByLabelText('Name'), 'AWS Certified');
    await user.type(screen.getByLabelText('Issuer'), 'Amazon');
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    await waitFor(() => expect(onChangeSuccess).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: 'Add certification' }),
      ).not.toBeInTheDocument(),
    );
  });

  it('remove keeps dialog open when onProfileChange rejects', async () => {
    const profile = makeProfile();
    const onChange = vi.fn().mockRejectedValue(new Error('fail'));
    const user = userEvent.setup();
    render(
      <CertificationsSection profile={profile} onProfileChange={onChange} />,
    );
    await user.click(screen.getByRole('button', { name: /Remove Cert A/i }));
    expect(
      screen.getByRole('dialog', { name: /Remove Cert A\?/i }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove' }));
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    expect(
      screen.getByRole('dialog', { name: /Remove Cert A\?/i }),
    ).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 10));
  });

  it('reorder attaches catch and handles no-op plus rejection', async () => {
    const profile = makeProfile();
    const { renderHook, act } = await import('@testing-library/react');
    const { useCertificationsSection } =
      await import('./hooks/useCertificationsSection');
    const onChange = vi.fn().mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() =>
      useCertificationsSection(profile, onChange),
    );
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
      useCertificationsSection(profile, onChange2),
    );
    act(() => result2.current.handleReorder(0, 0));
    expect(onChange2).not.toHaveBeenCalled();
  });

  it('dialog backdrop cannot cancel while pending', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <AddCertificationDialog
        open
        onCancel={onCancel}
        onSubmit={vi.fn()}
        pending
        error={null}
      />,
    );
    const dialog = screen.getByRole('dialog', { name: 'Add certification' });
    await user.click(dialog);
    expect(onCancel).not.toHaveBeenCalled();
    fireEvent.click(dialog);
    expect(onCancel).not.toHaveBeenCalled();
    rerender(
      <AddCertificationDialog
        open
        onCancel={onCancel}
        onSubmit={vi.fn()}
        pending={false}
        error={null}
      />,
    );
    await user.click(screen.getByRole('dialog', { name: 'Add certification' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('external error sync clears stale alert when prop becomes null while preserving local validation', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <AddCertificationDialog
        open
        onCancel={vi.fn()}
        onSubmit={onSubmit}
        error="External error"
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('External error');
    rerender(
      <AddCertificationDialog
        open
        onCancel={vi.fn()}
        onSubmit={onSubmit}
        error={null}
      />,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Name and issuer are required',
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('hook delegates immutable updates and CertificationItem is render-only', async () => {
    const profile = makeProfile();
    const onChange = vi.fn();
    const { renderHook, act } = await import('@testing-library/react');
    const { useCertificationsSection } =
      await import('./hooks/useCertificationsSection');
    const { result } = renderHook(() =>
      useCertificationsSection(profile, onChange),
    );
    expect(typeof result.current.updateName).toBe('function');
    expect(typeof result.current.updateIssuer).toBe('function');
    expect(typeof result.current.updateIssueDate).toBe('function');
    expect(typeof result.current.updateExpirationDate).toBe('function');

    act(() => result.current.updateName('cert-1', 'New Name'));
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    let next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.certifications[0].name).toBe('New Name');
    expect(profile.certifications[0].name).toBe('Cert A');
    onChange.mockClear();

    act(() => result.current.updateIssueDate('cert-1', '   '));
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    next = onChange.mock.calls[0][0] as CandidateProfileV1;
    expect(next.certifications[0].issueDate).toBeNull();

    const item = profile.certifications[0];
    const callbacks = {
      onNameSubmit: vi.fn(),
      onIssuerSubmit: vi.fn(),
      onIssueDateSubmit: vi.fn(),
      onExpirationDateSubmit: vi.fn(),
    };
    render(<CertificationItem item={item} {...callbacks} />);
    expect(
      screen.getByLabelText('Edit Certification name'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Edit Issuer')).toBeInTheDocument();
    expect(screen.queryByText(/credential/i)).not.toBeInTheDocument();
  });
});
