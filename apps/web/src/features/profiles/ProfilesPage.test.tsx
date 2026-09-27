import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import type { components } from '@talentor/contracts';
import { api } from '@/api/client';
import ProfilesPage from './ProfilesPage';

type ProfileMetadata = components['schemas']['ProfileMetadata'];
type ProfileSnapshot = components['schemas']['ProfileSnapshot'];

if (!Element.prototype.hasPointerCapture) {
  (Element.prototype as unknown as Record<string, unknown>).hasPointerCapture =
    () => false;
}
if (!Element.prototype.setPointerCapture) {
  (Element.prototype as unknown as Record<string, unknown>).setPointerCapture =
    () => {};
}
if (!Element.prototype.releasePointerCapture) {
  (
    Element.prototype as unknown as Record<string, unknown>
  ).releasePointerCapture = () => {};
}
if (!Element.prototype.scrollIntoView) {
  (Element.prototype as unknown as Record<string, unknown>).scrollIntoView =
    () => {};
}
if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = () => {};
}

vi.mock('@/features/profile/components/CreateProfileDialog', async () => {
  const React = await import('react');
  return {
    default: function MockCreateProfileDialog({
      open,
      pending,
      error,
      onCancel,
      onSubmit,
    }: any) {
      const [values, setValues] = React.useState({
        name: '',
        fullName: '',
        email: '',
        locale: '',
      });
      React.useEffect(() => {
        if (!open) setValues({ name: '', fullName: '', email: '', locale: '' });
      }, [open]);
      if (!open) return null;
      return (
        <div role="dialog" aria-label="Create profile">
          {error && <div role="alert">{error}</div>}
          <label>
            Profile name
            <input
              aria-label="Profile name"
              value={values.name}
              onChange={(e) =>
                setValues((v: any) => ({ ...v, name: e.target.value }))
              }
              disabled={pending}
            />
          </label>
          <label>
            Full name
            <input
              aria-label="Full name"
              value={values.fullName}
              onChange={(e) =>
                setValues((v: any) => ({ ...v, fullName: e.target.value }))
              }
              disabled={pending}
            />
          </label>
          <label>
            Email
            <input
              aria-label="Email"
              value={values.email}
              onChange={(e) =>
                setValues((v: any) => ({ ...v, email: e.target.value }))
              }
              disabled={pending}
            />
          </label>
          <label>
            Locale
            <input
              aria-label="Locale"
              value={values.locale}
              onChange={(e) =>
                setValues((v: any) => ({ ...v, locale: e.target.value }))
              }
              disabled={pending}
            />
          </label>
          <button
            type="button"
            onClick={() =>
              void onSubmit({
                name: values.name.trim(),
                fullName: values.fullName.trim(),
                email: values.email.trim(),
                locale: values.locale.trim(),
              })
            }
            disabled={pending}
          >
            Create
          </button>
          <button type="button" onClick={onCancel} disabled={pending}>
            Cancel
          </button>
        </div>
      );
    },
  };
});

function makeMeta(id: string, name: string): ProfileMetadata {
  return {
    id,
    name,
    currentVersion: 1,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  } as ProfileMetadata;
}

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return qc;
}

function renderPage(qc: QueryClient) {
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/profiles']}>
        <Routes>
          <Route path="/profiles" element={<ProfilesPage />} />
          <Route path="/profile/:profileId" element={<div>detail</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

describe('ProfilesPage', () => {
  it('shows loading state', async () => {
    let resolve!: (v: ProfileMetadata[]) => void;
    vi.spyOn(api.profiles, 'list').mockImplementation(
      () => new Promise((res) => (resolve = res)),
    );
    const qc = createWrapper();
    renderPage(qc);
    expect(
      screen.getByRole('status', { name: /loading profiles/i }),
    ).toBeInTheDocument();
    resolve([]);
    await waitFor(() =>
      expect(
        screen.queryByRole('status', { name: /loading profiles/i }),
      ).not.toBeInTheDocument(),
    );
  });

  it('shows error with retry', async () => {
    vi.spyOn(api.profiles, 'list').mockRejectedValue(
      new Error('Network failed'),
    );
    const qc = createWrapper();
    renderPage(qc);
    expect(await screen.findByText('Network failed')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();

    vi.spyOn(api.profiles, 'list').mockResolvedValue([
      makeMeta('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'One'),
    ]);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /retry/i }));
    await waitFor(() =>
      expect(
        screen.getByRole('link', { name: /view profile one/i }),
      ).toBeInTheDocument(),
    );
  });

  it('shows empty state with create CTA', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([]);
    const qc = createWrapper();
    renderPage(qc);
    expect(await screen.findByText(/no profiles yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create profile/i }),
    ).toBeInTheDocument();
    // header also shows New profile
    expect(
      screen.getByRole('button', { name: /new profile/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('list', { name: /profiles/i }),
    ).not.toBeInTheDocument();
  });

  it('renders profiles as accessible cards/links', async () => {
    const metas = [
      makeMeta('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Alpha'),
      makeMeta('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Beta'),
    ];
    vi.spyOn(api.profiles, 'list').mockResolvedValue(metas);
    const qc = createWrapper();
    renderPage(qc);

    const list = await screen.findByRole('list', { name: /profiles/i });
    expect(list).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);

    const alphaLink = screen.getByRole('link', { name: /view profile alpha/i });
    expect(alphaLink).toHaveAttribute(
      'href',
      '/profile/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    );
    const betaLink = screen.getByRole('link', { name: /view profile beta/i });
    expect(betaLink).toHaveAttribute(
      'href',
      '/profile/b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    );

    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    // header count
    expect(screen.getByText(/2 profiles total/i)).toBeInTheDocument();
  });

  it('opens create dialog and shows error on failure', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([]);
    vi.spyOn(api.profiles, 'create').mockRejectedValue(
      new Error('Duplicate name'),
    );
    const qc = createWrapper();
    renderPage(qc);
    await screen.findByText(/no profiles yet/i);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /create profile/i }));
    await screen.findByRole('dialog');
    await user.type(screen.getByLabelText(/profile name/i), 'Dup');
    await user.type(screen.getByLabelText(/^full name/i), 'Ada');
    await user.type(screen.getByLabelText(/^email/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/locale/i), 'en-US');
    await user.click(screen.getByRole('button', { name: /^create$/i }));
    expect(await screen.findByText('Duplicate name')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('creates profile navigates to detail', async () => {
    const newId = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';
    vi.spyOn(api.profiles, 'list').mockResolvedValue([]);
    const snap = {
      id: newId,
      name: 'Backend',
      currentVersion: 1,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
      profile: {
        schemaVersion: 1,
        locale: 'en-US',
        personalInfo: { fullName: 'Ada', email: 'ada@example.com', links: [] },
        experience: [],
        skills: [],
        languages: [],
        education: [],
        projects: [],
        certifications: [],
      },
    } as unknown as ProfileSnapshot;
    let captured: unknown = null;
    const createSpy = vi
      .spyOn(api.profiles, 'create')
      .mockImplementation(async (payload: any) => {
        captured = payload;
        return snap;
      });
    const qc = createWrapper();
    renderPage(qc);
    await screen.findByText(/no profiles yet/i);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /create profile/i }));
    const dialog = await screen.findByRole('dialog');
    await user.type(
      dialog.querySelector('[aria-label="Profile name"]') as Element,
      'Backend',
    );
    await user.type(
      dialog.querySelector('[aria-label="Full name"]') as Element,
      'Ada Lovelace',
    );
    await user.type(
      dialog.querySelector('[aria-label="Email"]') as Element,
      'ada@example.com',
    );
    await user.type(
      dialog.querySelector('[aria-label="Locale"]') as Element,
      'en-US',
    );
    await user.click(await screen.findByRole('button', { name: /^create$/i }));
    await waitFor(() => expect(createSpy).toHaveBeenCalledTimes(1));
    expect(captured).toEqual({
      name: 'Backend',
      profile: {
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
      },
    });
    expect(await screen.findByText('detail')).toBeInTheDocument();
  });
});
