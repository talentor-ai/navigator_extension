/* eslint-disable react-hooks/rules-of-hooks */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  within,
  cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import type { components } from '@talentor/contracts';
import { api } from '@/api/client';
import ProfilePage from './ProfilePage';
import { profileKeys } from './profile.api';

if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
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
if (!HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.scrollIntoView) {
  (Element.prototype as unknown as Record<string, unknown>).scrollIntoView =
    () => {};
}
if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = () => {};
}

type ProfileSnapshot = components['schemas']['ProfileSnapshot'];
type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];
type ProfileMetadata = components['schemas']['ProfileMetadata'];
type ProfileVersionMetadata = components['schemas']['ProfileVersionMetadata'];

const PROFILE_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
const PROFILE_ID_2 = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';

// Polyfill for Radix + ensure deterministic CreateProfileDialog for tests
vi.mock('./components/CreateProfileDialog', async () => {
  const React = await import('react');
  return {
    default: ({ open, pending, error, onCancel, onSubmit }: any) => {
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

vi.mock('./components/VersionSwitcher', async () => {
  const React = await import('react');
  return {
    default: ({
      versions,
      currentVersion,
      previewVersion,
      pendingVersion,
      error,
      onPreview,
      onActivate,
      onExitPreview,
    }: any) => {
      const [confirm, setConfirm] = React.useState<number | null>(null);
      return (
        <div>
          <h2>Versions</h2>
          {previewVersion !== null && (
            <div>
              Previewing version {previewVersion} — read-only{' '}
              <button onClick={onExitPreview}>Exit preview</button>
            </div>
          )}
          {error && <div role="alert">{error}</div>}
          <ul aria-label="Profile versions">
            {versions.map((v: any) => (
              <li key={v.id}>
                <span>Version {v.versionNumber}</span>
                {v.versionNumber === currentVersion && <span>Current</span>}
                {confirm === v.versionNumber ? (
                  <>
                    <span>Confirm activation?</span>
                    <button
                      onClick={() => {
                        onActivate(v.versionNumber);
                        setConfirm(null);
                      }}
                      disabled={pendingVersion === v.versionNumber}
                    >
                      {pendingVersion === v.versionNumber
                        ? 'Activating...'
                        : 'Confirm'}
                    </button>
                    <button onClick={() => setConfirm(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onPreview(v.versionNumber)}
                      disabled={previewVersion === v.versionNumber}
                    >
                      Preview
                    </button>
                    <button
                      aria-label={
                        pendingVersion === v.versionNumber
                          ? `Activating version ${v.versionNumber}`
                          : `Activate version ${v.versionNumber}`
                      }
                      onClick={() => setConfirm(v.versionNumber)}
                      disabled={v.versionNumber === currentVersion}
                    >
                      {pendingVersion === v.versionNumber
                        ? 'Activating...'
                        : 'Activate'}
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    },
  };
});

// Mock leaf components to observe props delegation and readOnly/pending
vi.mock('./components/ProfileHeader', () => ({
  default: (props: any) => (
    <div
      data-testid="mock-header"
      data-readonly={String(!!props.readOnly)}
      data-pending={String(!!props.pending)}
      onClick={() => {
        if (props.onProfileChange && !props.readOnly && !props.pending) {
          void (
            props.onProfileChange({
              ...props.profile,
              baseSummary: 'edited',
            }) as Promise<unknown>
          )?.catch?.(() => {});
        }
      }}
    >
      {props.profile?.personalInfo?.fullName ?? 'no-header'}
    </div>
  ),
}));
vi.mock('./components/ContactDetails', () => ({
  default: (props: any) => (
    <div
      data-testid="mock-contact"
      data-readonly={String(!!props.readOnly)}
      data-pending={String(!!props.pending)}
    >
      {props.profile?.personalInfo?.email ?? 'no-contact'}
    </div>
  ),
}));
vi.mock('./sections/SummarySection', () => ({
  default: (props: any) => (
    <div
      data-testid="mock-summary"
      data-readonly={String(!!props.readOnly)}
      data-pending={String(!!props.pending)}
    >
      summary:{props.profile?.baseSummary ?? 'empty'}
    </div>
  ),
}));
vi.mock('./sections/ExperienceSection', () => ({
  default: (props: any) => (
    <div
      data-testid="mock-experience"
      data-readonly={String(!!props.readOnly)}
      data-pending={String(!!props.pending)}
    >
      exp:{props.profile?.experience?.length ?? 0}
    </div>
  ),
}));
vi.mock('./sections/ProjectsSection', () => ({
  default: (props: any) => (
    <div
      data-testid="mock-projects"
      data-readonly={String(!!props.readOnly)}
      data-pending={String(!!props.pending)}
    >
      projects:{props.profile?.projects?.length ?? 0}
    </div>
  ),
}));
vi.mock('./sections/SkillsSection', () => ({
  default: (props: any) => (
    <div
      data-testid="mock-skills"
      data-readonly={String(!!props.readOnly)}
      data-pending={String(!!props.pending)}
    >
      skills
    </div>
  ),
}));
vi.mock('./sections/LanguagesSection', () => ({
  default: (props: any) => (
    <div
      data-testid="mock-languages"
      data-readonly={String(!!props.readOnly)}
      data-pending={String(!!props.pending)}
    >
      lang
    </div>
  ),
}));
vi.mock('./sections/EducationSection', () => ({
  default: (props: any) => (
    <div
      data-testid="mock-education"
      data-readonly={String(!!props.readOnly)}
      data-pending={String(!!props.pending)}
    >
      edu
    </div>
  ),
}));
vi.mock('./sections/CertificationsSection', () => ({
  default: (props: any) => (
    <div
      data-testid="mock-certs"
      data-readonly={String(!!props.readOnly)}
      data-pending={String(!!props.pending)}
    >
      certs
    </div>
  ),
}));

function makeSnapshot(overrides?: Partial<ProfileSnapshot>): ProfileSnapshot {
  const base: ProfileSnapshot = {
    id: PROFILE_ID,
    name: 'Test Profile',
    currentVersion: 2,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
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
    } as CandidateProfileV1,
  } as ProfileSnapshot;
  return { ...base, ...overrides } as ProfileSnapshot;
}

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

function renderPage(initialEntries: string[], qc: QueryClient) {
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/profile/:profileId?" element={<ProfilePage />} />
          <Route path="/login" element={<div>login</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

describe('ProfilePage', () => {
  it('empty list shows EmptyProfileState with create CTA', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([]);
    const qc = createWrapper();
    renderPage(['/profile'], qc);

    expect(await screen.findByText(/no profile yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create profile/i }),
    ).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /create profile/i }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/profile name/i)).toBeInTheDocument();
  });

  it('redirects to first profile when no route ID and list has items', async () => {
    const metas = [
      makeMeta(PROFILE_ID, 'First'),
      makeMeta(PROFILE_ID_2, 'Second'),
    ];
    vi.spyOn(api.profiles, 'list').mockResolvedValue(metas);
    const snap = makeSnapshot();
    vi.spyOn(api.profiles, 'get').mockResolvedValue(snap);
    vi.spyOn(api.profiles, 'listVersions').mockResolvedValue([]);

    const qc = createWrapper();
    renderPage(['/profile'], qc);

    await waitFor(() =>
      expect(screen.getByTestId('mock-header')).toBeInTheDocument(),
    );
    expect(screen.getByTestId('mock-header')).toHaveTextContent('Ada Lovelace');
    expect(api.profiles.get).toHaveBeenCalledWith(PROFILE_ID);
  });

  it('renders API-loaded profile', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([
      makeMeta(PROFILE_ID, 'Test'),
    ]);
    const snap = makeSnapshot({
      profile: {
        ...makeSnapshot().profile,
        personalInfo: {
          fullName: 'Grace Hopper',
          email: 'grace@example.com',
          links: [],
        },
        baseSummary: 'summary here',
      } as CandidateProfileV1,
    } as Partial<ProfileSnapshot>);
    vi.spyOn(api.profiles, 'get').mockResolvedValue(snap);
    vi.spyOn(api.profiles, 'listVersions').mockResolvedValue([]);

    const qc = createWrapper();
    renderPage([`/profile/${PROFILE_ID}`], qc);

    expect(await screen.findByTestId('mock-header')).toHaveTextContent(
      'Grace Hopper',
    );
    expect(screen.getByTestId('mock-contact')).toHaveTextContent(
      'grace@example.com',
    );
    expect(screen.getByTestId('mock-summary')).toHaveTextContent(
      'summary here',
    );
  });

  it('shows skeleton while loading and error with retry', async () => {
    let resolveList!: (v: ProfileMetadata[]) => void;
    vi.spyOn(api.profiles, 'list').mockImplementation(
      () => new Promise((res) => (resolveList = res)),
    );
    const qc = createWrapper();
    renderPage(['/profile'], qc);
    expect(
      screen.getByRole('status', { name: /loading profile/i }),
    ).toBeInTheDocument();
    resolveList([makeMeta(PROFILE_ID, 'Test')]);
    await waitFor(() =>
      expect(
        screen.queryByRole('status', { name: /loading profile/i }),
      ).not.toBeInTheDocument(),
    );

    vi.restoreAllMocks();
    cleanup();
    const qc2 = createWrapper();
    vi.spyOn(api.profiles, 'list').mockRejectedValue(
      new Error('Network failed'),
    );
    render(
      <QueryClientProvider client={qc2}>
        <MemoryRouter initialEntries={['/profile']}>
          <Routes>
            <Route path="/profile/:profileId?" element={<ProfilePage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(await screen.findByText('Network failed')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    vi.spyOn(api.profiles, 'list').mockResolvedValue([
      makeMeta(PROFILE_ID, 'Test'),
    ]);
    vi.spyOn(api.profiles, 'get').mockResolvedValue(makeSnapshot());
    vi.spyOn(api.profiles, 'listVersions').mockResolvedValue([]);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /retry/i }));
    await waitFor(() =>
      expect(screen.getByTestId('mock-header')).toBeInTheDocument(),
    );
  });

  it('detail error shows ProfileErrorState with retry', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([
      makeMeta(PROFILE_ID, 'Test'),
    ]);
    vi.spyOn(api.profiles, 'get').mockRejectedValue(new Error('Detail failed'));
    vi.spyOn(api.profiles, 'listVersions').mockResolvedValue([]);
    const qc = createWrapper();
    renderPage([`/profile/${PROFILE_ID}`], qc);
    expect(await screen.findByText('Detail failed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    vi.spyOn(api.profiles, 'get').mockResolvedValue(makeSnapshot());
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /retry/i }));
    await waitFor(() =>
      expect(screen.getByTestId('mock-header')).toBeInTheDocument(),
    );
  });

  it('create flow builds minimal payload and shows error on failure', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([
      makeMeta(PROFILE_ID, 'Test'),
    ]);
    vi.spyOn(api.profiles, 'get').mockResolvedValue(makeSnapshot());
    vi.spyOn(api.profiles, 'listVersions').mockResolvedValue([]);
    vi.spyOn(api.profiles, 'create').mockRejectedValue(
      new Error('Duplicate name'),
    );
    const qc2 = createWrapper();
    render(
      <QueryClientProvider client={qc2}>
        <MemoryRouter initialEntries={[`/profile/${PROFILE_ID}`]}>
          <Routes>
            <Route path="/profile/:profileId?" element={<ProfilePage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    await screen.findByTestId('mock-header');
    const user2 = userEvent.setup();
    await user2.click(screen.getByRole('button', { name: /new profile/i }));
    const dialog2 = await screen.findByRole('dialog');
    await user2.type(within(dialog2).getByLabelText(/profile name/i), 'Dup');
    await user2.type(within(dialog2).getByLabelText(/^full name/i), 'Ada');
    await user2.type(
      within(dialog2).getByLabelText(/^email/i),
      'ada@example.com',
    );
    await user2.type(within(dialog2).getByLabelText(/locale/i), 'en-US');
    await user2.click(
      within(dialog2).getByRole('button', { name: /^create$/i }),
    );
    expect(
      await within(dialog2).findByText('Duplicate name'),
    ).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('create flow builds minimal payload and navigates on success', async () => {
    const newId = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';
    const metas = [makeMeta(PROFILE_ID, 'Existing')];
    vi.spyOn(api.profiles, 'list').mockResolvedValue(metas);
    // need to handle get for both old and new id
    vi.spyOn(api.profiles, 'get').mockImplementation(async (id: string) =>
      makeSnapshot({ id } as Partial<ProfileSnapshot>),
    );
    vi.spyOn(api.profiles, 'listVersions').mockResolvedValue([]);
    let capturedPayload: any = null;
    const createSpy = vi
      .spyOn(api.profiles, 'create')
      .mockImplementation(async (payload: any) => {
        capturedPayload = payload;
        return makeSnapshot({
          id: newId,
          name: payload.name,
        } as Partial<ProfileSnapshot>);
      });

    const qc = createWrapper();
    renderPage([`/profile/${PROFILE_ID}`], qc);
    await screen.findByTestId('mock-header');

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /new profile/i }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    await user.type(within(dialog).getByLabelText(/profile name/i), 'Backend');
    await user.type(
      within(dialog).getByLabelText(/^full name/i),
      'Ada Lovelace',
    );
    await user.type(
      within(dialog).getByLabelText(/^email/i),
      'ada@example.com',
    );
    await user.type(within(dialog).getByLabelText(/locale/i), 'en-US');
    await user.click(within(dialog).getByRole('button', { name: /^create$/i }));

    await waitFor(() => expect(createSpy).toHaveBeenCalledTimes(1));
    expect(capturedPayload).toEqual({
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

    // Dialog should close on success (allow animation time)
    await waitFor(
      () =>
        expect(
          screen.queryByLabelText(/profile name/i),
        ).not.toBeInTheDocument(),
      { timeout: 2500 },
    );
    // Also ensure navigate was triggered by checking that detail fetch for newId eventually called
    await waitFor(() => expect(api.profiles.get).toHaveBeenCalledWith(newId), {
      timeout: 2000,
    });
  });

  it('historical preview renders readOnly snapshot and exit restores current', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([
      makeMeta(PROFILE_ID, 'Test'),
    ]);
    const currentSnap = makeSnapshot({
      profile: {
        ...makeSnapshot().profile,
        personalInfo: {
          fullName: 'Current Name',
          email: 'current@example.com',
          links: [],
        },
      } as CandidateProfileV1,
    } as Partial<ProfileSnapshot>);
    vi.spyOn(api.profiles, 'get').mockResolvedValue(currentSnap);
    const versions: ProfileVersionMetadata[] = [
      {
        id: 'v3',
        versionNumber: 3,
        schemaVersion: 1,
        sourceType: 'MANUAL',
        createdAt: '2025-03-10T14:30:00.000Z',
        isCurrent: true,
      } as ProfileVersionMetadata,
      {
        id: 'v2',
        versionNumber: 2,
        schemaVersion: 1,
        sourceType: 'MANUAL',
        createdAt: '2025-03-09T14:30:00.000Z',
        isCurrent: false,
      } as ProfileVersionMetadata,
    ];
    vi.spyOn(api.profiles, 'listVersions').mockResolvedValue(versions);
    const previewProfile: CandidateProfileV1 = {
      ...makeSnapshot().profile,
      personalInfo: {
        fullName: 'Historical Name',
        email: 'hist@example.com',
        links: [],
      },
    } as CandidateProfileV1;
    vi.spyOn(api.profiles, 'getVersion').mockResolvedValue({
      profileId: PROFILE_ID,
      name: 'Test',
      version: versions[1],
      profile: previewProfile,
    } as components['schemas']['ProfileVersionSnapshot']);

    const qc = createWrapper();
    renderPage([`/profile/${PROFILE_ID}`], qc);
    await screen.findByTestId('mock-header');
    expect(screen.getByTestId('mock-header')).toHaveTextContent('Current Name');
    expect(screen.getByTestId('mock-header')).toHaveAttribute(
      'data-readonly',
      'false',
    );

    const versionSwitcher = await screen.findByText(/versions/i);
    expect(versionSwitcher).toBeInTheDocument();
    const previewBtn =
      screen.getAllByRole('button', { name: /preview/i })[1] ??
      screen.getAllByRole('button', { name: /preview/i })[0];
    const user = userEvent.setup();
    await user.click(previewBtn);

    expect(
      await screen.findByText(/previewing version 2/i),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByTestId('mock-header')).toHaveTextContent(
        'Historical Name',
      ),
    );
    expect(screen.getByTestId('mock-header')).toHaveAttribute(
      'data-readonly',
      'true',
    );
    expect(screen.getByTestId('mock-contact')).toHaveAttribute(
      'data-readonly',
      'true',
    );

    await user.click(screen.getByRole('button', { name: /exit preview/i }));
    await waitFor(() =>
      expect(screen.getByTestId('mock-header')).toHaveTextContent(
        'Current Name',
      ),
    );
    expect(screen.getByTestId('mock-header')).toHaveAttribute(
      'data-readonly',
      'false',
    );
  });

  it('activation invokes mutation and exits preview on success', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([
      makeMeta(PROFILE_ID, 'Test'),
    ]);
    vi.spyOn(api.profiles, 'get').mockResolvedValue(
      makeSnapshot({ currentVersion: 3 } as Partial<ProfileSnapshot>),
    );
    const versions: ProfileVersionMetadata[] = [
      {
        id: 'v3',
        versionNumber: 3,
        schemaVersion: 1,
        sourceType: 'MANUAL',
        createdAt: '2025-03-10T14:30:00.000Z',
        isCurrent: true,
      } as ProfileVersionMetadata,
      {
        id: 'v1',
        versionNumber: 1,
        schemaVersion: 1,
        sourceType: 'MANUAL',
        createdAt: '2025-03-08T14:30:00.000Z',
        isCurrent: false,
      } as ProfileVersionMetadata,
    ];
    vi.spyOn(api.profiles, 'listVersions').mockResolvedValue(versions);
    vi.spyOn(api.profiles, 'getVersion').mockResolvedValue({
      profileId: PROFILE_ID,
      name: 'Test',
      version: versions[1],
      profile: makeSnapshot().profile,
    } as any);
    const activateSpy = vi
      .spyOn(api.profiles, 'activateVersion')
      .mockResolvedValue(
        makeSnapshot({ currentVersion: 4 } as Partial<ProfileSnapshot>),
      );

    const qc = createWrapper();
    renderPage([`/profile/${PROFILE_ID}`], qc);
    await screen.findByText(/versions/i);
    const previewBtns = screen.getAllByRole('button', { name: /preview/i });
    const user = userEvent.setup();
    await user.click(previewBtns[1] ?? previewBtns[0]);
    await screen.findByText(/previewing version 1/i);

    const activateBtn = screen.getByRole('button', {
      name: /activate version 1/i,
    });
    await user.click(activateBtn);
    const confirmBtn = screen.getByRole('button', { name: /^confirm$/i });
    await user.click(confirmBtn);

    await waitFor(() => expect(activateSpy).toHaveBeenCalled());
    await waitFor(() =>
      expect(
        screen.queryByText(/previewing version 1/i),
      ).not.toBeInTheDocument(),
    );
  });

  it('activation shows error on failure', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([
      makeMeta(PROFILE_ID, 'Test'),
    ]);
    vi.spyOn(api.profiles, 'get').mockResolvedValue(
      makeSnapshot({ currentVersion: 3 } as Partial<ProfileSnapshot>),
    );
    const versions: ProfileVersionMetadata[] = [
      {
        id: 'v3',
        versionNumber: 3,
        schemaVersion: 1,
        sourceType: 'MANUAL',
        createdAt: '2025-03-10T14:30:00.000Z',
        isCurrent: true,
      } as ProfileVersionMetadata,
      {
        id: 'v1',
        versionNumber: 1,
        schemaVersion: 1,
        sourceType: 'MANUAL',
        createdAt: '2025-03-08T14:30:00.000Z',
        isCurrent: false,
      } as ProfileVersionMetadata,
    ];
    vi.spyOn(api.profiles, 'listVersions').mockResolvedValue(versions);
    vi.spyOn(api.profiles, 'getVersion').mockResolvedValue({
      profileId: PROFILE_ID,
      name: 'Test',
      version: versions[1],
      profile: makeSnapshot().profile,
    } as any);
    vi.spyOn(api.profiles, 'activateVersion').mockRejectedValue(
      new Error('Activate failed'),
    );
    const qc2 = createWrapper();
    render(
      <QueryClientProvider client={qc2}>
        <MemoryRouter initialEntries={[`/profile/${PROFILE_ID}`]}>
          <Routes>
            <Route path="/profile/:profileId?" element={<ProfilePage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    await screen.findByText(/versions/i);
    const user2 = userEvent.setup();
    const pBtns2 = screen.getAllByRole('button', { name: /preview/i });
    await user2.click(pBtns2[1] ?? pBtns2[0]);
    await screen.findByText(/previewing version 1/i);
    await user2.click(
      screen.getByRole('button', { name: /activate version 1/i }),
    );
    await user2.click(screen.getByRole('button', { name: /^confirm$/i }));
    expect(await screen.findByText('Activate failed')).toBeInTheDocument();
  });

  it('save mutation delegation passes updateMutation.mutateAsync and pending to leaves, shows save error', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([
      makeMeta(PROFILE_ID, 'Test'),
    ]);
    vi.spyOn(api.profiles, 'get').mockResolvedValue(makeSnapshot());
    vi.spyOn(api.profiles, 'listVersions').mockResolvedValue([]);
    let capturedNext: any = null;
    const updateSpy = vi
      .spyOn(api.profiles, 'update')
      .mockImplementation(async (_id, body: any) => {
        capturedNext = body.profile;
        throw new Error('Save failed');
      });

    const qc = createWrapper();
    renderPage([`/profile/${PROFILE_ID}`], qc);
    const header = await screen.findByTestId('mock-header');
    expect(header).toHaveAttribute('data-pending', 'false');
    const user = userEvent.setup();
    await user.click(header);
    expect(updateSpy).toHaveBeenCalled();
    expect(capturedNext).toHaveProperty('baseSummary', 'edited');
    expect(await screen.findByText('Save failed')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Save failed');
  });

  it('pending state disables all leaves during save', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([
      makeMeta(PROFILE_ID, 'Test'),
    ]);
    vi.spyOn(api.profiles, 'get').mockResolvedValue(makeSnapshot());
    vi.spyOn(api.profiles, 'listVersions').mockResolvedValue([]);
    let resolveUpdate!: (v: ProfileSnapshot) => void;
    vi.spyOn(api.profiles, 'update').mockImplementation(
      () => new Promise((res) => (resolveUpdate = res)) as any,
    );
    const qc2 = createWrapper();
    qc2.setQueryData(['profiles', 'detail', PROFILE_ID], makeSnapshot());
    render(
      <QueryClientProvider client={qc2}>
        <MemoryRouter initialEntries={[`/profile/${PROFILE_ID}`]}>
          <Routes>
            <Route path="/profile/:profileId?" element={<ProfilePage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const header2 = await screen.findByTestId('mock-header');
    const user2 = userEvent.setup();
    void user2.click(header2);
    await waitFor(() =>
      expect(screen.getByTestId('mock-header')).toHaveAttribute(
        'data-pending',
        'true',
      ),
    );
    expect(screen.getByTestId('mock-contact')).toHaveAttribute(
      'data-pending',
      'true',
    );
    expect(screen.getByTestId('mock-summary')).toHaveAttribute(
      'data-pending',
      'true',
    );
    resolveUpdate!(makeSnapshot({ currentVersion: 3 } as any));
    await waitFor(() =>
      expect(screen.getByTestId('mock-header')).toHaveAttribute(
        'data-pending',
        'false',
      ),
    );
  });

  it('profile selector navigates to selected profile', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([
      makeMeta(PROFILE_ID, 'First'),
      makeMeta(PROFILE_ID_2, 'Second'),
    ]);
    vi.spyOn(api.profiles, 'get').mockImplementation(async (id: string) =>
      makeSnapshot({ id } as Partial<ProfileSnapshot>),
    );
    vi.spyOn(api.profiles, 'listVersions').mockResolvedValue([]);

    const qc = createWrapper();
    renderPage([`/profile/${PROFILE_ID}`], qc);
    await screen.findByTestId('mock-header');

    const user = userEvent.setup();
    const trigger = screen.getByRole('combobox', { name: /select profile/i });
    await user.click(trigger);
    const option = await screen.findByRole('option', { name: 'Second' });
    await user.click(option);
    await waitFor(() =>
      expect(api.profiles.get).toHaveBeenCalledWith(PROFILE_ID_2),
    );
  });

  it('preview loading shows skeleton', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([
      makeMeta(PROFILE_ID, 'Test'),
    ]);
    vi.spyOn(api.profiles, 'get').mockResolvedValue(makeSnapshot());
    vi.spyOn(api.profiles, 'listVersions').mockResolvedValue([
      {
        id: 'v3',
        versionNumber: 3,
        schemaVersion: 1,
        sourceType: 'MANUAL',
        createdAt: '2025-03-10T14:30:00.000Z',
        isCurrent: true,
      } as any,
      {
        id: 'v2',
        versionNumber: 2,
        schemaVersion: 1,
        sourceType: 'MANUAL',
        createdAt: '2025-03-09T14:30:00.000Z',
        isCurrent: false,
      } as any,
    ]);
    let resolveVersion!: (v: any) => void;
    vi.spyOn(api.profiles, 'getVersion').mockImplementation(
      () => new Promise((res) => (resolveVersion = res)) as any,
    );

    const qc = createWrapper();
    renderPage([`/profile/${PROFILE_ID}`], qc);
    await screen.findByText(/versions/i);
    const user = userEvent.setup();
    await user.click(
      screen.getAllByRole('button', { name: /preview/i })[1] ??
        screen.getAllByRole('button', { name: /preview/i })[0],
    );
    expect(
      await screen.findByRole('status', { name: /loading profile/i }),
    ).toBeInTheDocument();
    resolveVersion!({
      profileId: PROFILE_ID,
      name: 'Test',
      version: { versionNumber: 2 },
      profile: makeSnapshot().profile,
    } as any);
    await waitFor(() =>
      expect(screen.getByTestId('mock-header')).toBeInTheDocument(),
    );
  });

  it('shows accessible loading status while versions initially load instead of misleading No versions yet', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([
      makeMeta(PROFILE_ID, 'Test'),
    ]);
    vi.spyOn(api.profiles, 'get').mockResolvedValue(makeSnapshot());
    let resolveVersions!: (v: ProfileVersionMetadata[]) => void;
    vi.spyOn(api.profiles, 'listVersions').mockImplementation(
      () => new Promise((res) => (resolveVersions = res)) as any,
    );
    const qc = createWrapper();
    renderPage([`/profile/${PROFILE_ID}`], qc);
    await screen.findByTestId('mock-header');
    expect(
      screen.getByRole('status', { name: /loading versions/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/loading versions/i)).toBeInTheDocument();
    // must not show VersionSwitcher content yet
    expect(screen.queryByText(/no versions yet/i)).not.toBeInTheDocument();
    resolveVersions!([]);
    await waitFor(() =>
      expect(screen.getByText(/versions/i)).toBeInTheDocument(),
    );
  });

  it('surfaces versions-list fetch error in VersionSwitcher', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([
      makeMeta(PROFILE_ID, 'Test'),
    ]);
    vi.spyOn(api.profiles, 'get').mockResolvedValue(makeSnapshot());
    vi.spyOn(api.profiles, 'listVersions').mockRejectedValue(
      new Error('Versions failed'),
    );
    const qc = createWrapper();
    renderPage([`/profile/${PROFILE_ID}`], qc);
    await screen.findByTestId('mock-header');
    expect(await screen.findByText('Versions failed')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Versions failed');
  });

  it('activation error takes priority over versions-list error', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([
      makeMeta(PROFILE_ID, 'Test'),
    ]);
    vi.spyOn(api.profiles, 'get').mockResolvedValue(
      makeSnapshot({ currentVersion: 3 } as Partial<ProfileSnapshot>),
    );
    const versions: ProfileVersionMetadata[] = [
      {
        id: 'v3',
        versionNumber: 3,
        schemaVersion: 1,
        sourceType: 'MANUAL',
        createdAt: '2025-03-10T14:30:00.000Z',
        isCurrent: true,
      } as ProfileVersionMetadata,
      {
        id: 'v1',
        versionNumber: 1,
        schemaVersion: 1,
        sourceType: 'MANUAL',
        createdAt: '2025-03-08T14:30:00.000Z',
        isCurrent: false,
      } as ProfileVersionMetadata,
    ];
    // Pre-populate versions data so UI has buttons even when fetch fails and error shows
    vi.spyOn(api.profiles, 'listVersions').mockRejectedValue(
      new Error('Versions failed'),
    );
    vi.spyOn(api.profiles, 'getVersion').mockResolvedValue({
      profileId: PROFILE_ID,
      name: 'Test',
      version: versions[1],
      profile: makeSnapshot().profile,
    } as any);
    vi.spyOn(api.profiles, 'activateVersion').mockRejectedValue(
      new Error('Activate failed'),
    );
    const qc = createWrapper();
    // Seed versions data before render so VersionSwitcher still has items when query errors
    qc.setQueryData(profileKeys.versions(PROFILE_ID), versions);
    renderPage([`/profile/${PROFILE_ID}`], qc);
    // Wait for profile header and then error appears (versions query will error but keep seed data)
    await screen.findByTestId('mock-header');
    await waitFor(() =>
      expect(screen.getByText('Versions failed')).toBeInTheDocument(),
    );
    // VersionSwitcher should still render versions because we seeded data
    expect(await screen.findByText(/version 1/i)).toBeInTheDocument();
    const user = userEvent.setup();
    const previewBtns = screen.getAllByRole('button', { name: /preview/i });
    await user.click(previewBtns[1] ?? previewBtns[0]);
    await screen.findByText(/previewing version 1/i);
    await user.click(
      screen.getByRole('button', { name: /activate version 1/i }),
    );
    await user.click(screen.getByRole('button', { name: /^confirm$/i }));
    expect(await screen.findByText('Activate failed')).toBeInTheDocument();
    // should not still show versions failed when activation error present
    expect(screen.queryByText('Versions failed')).not.toBeInTheDocument();
  });

  it('never returns blank for missing preview snapshot – shows skeleton or error', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([
      makeMeta(PROFILE_ID, 'Test'),
    ]);
    vi.spyOn(api.profiles, 'get').mockResolvedValue(makeSnapshot());
    vi.spyOn(api.profiles, 'listVersions').mockResolvedValue([
      {
        id: 'v2',
        versionNumber: 2,
        schemaVersion: 1,
        sourceType: 'MANUAL',
        createdAt: '2025-03-09T14:30:00.000Z',
        isCurrent: false,
      } as any,
      {
        id: 'v3',
        versionNumber: 3,
        schemaVersion: 1,
        sourceType: 'MANUAL',
        createdAt: '2025-03-10T14:30:00.000Z',
        isCurrent: true,
      } as any,
    ]);
    // return snapshot with no profile (simulates missing snapshot)
    vi.spyOn(api.profiles, 'getVersion').mockResolvedValue({
      profileId: PROFILE_ID,
      name: 'Test',
      version: { versionNumber: 2 } as any,
      profile: undefined as any,
    } as any);
    const qc = createWrapper();
    renderPage([`/profile/${PROFILE_ID}`], qc);
    await screen.findByText(/versions/i);
    const user = userEvent.setup();
    await user.click(screen.getAllByRole('button', { name: /preview/i })[0]);
    await waitFor(() => {
      const hasSkeleton = screen.queryByRole('status', {
        name: /loading profile/i,
      });
      const hasAlert = screen.queryByRole('alert');
      const hasHeader = screen.queryByTestId('mock-header');
      // should have either skeleton/error or still header, but never blank
      expect(hasSkeleton || hasAlert || hasHeader).toBeTruthy();
      expect(document.body.textContent?.trim().length).toBeGreaterThan(0);
    });
    // ensure not blank page (body not empty, not just null)
    expect(document.body.innerHTML.trim()).not.toBe('');
  });

  it('activation uses number-only mutation with hook-level profileId', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([
      makeMeta(PROFILE_ID, 'Test'),
    ]);
    vi.spyOn(api.profiles, 'get').mockResolvedValue(
      makeSnapshot({ currentVersion: 3 } as Partial<ProfileSnapshot>),
    );
    const versions: ProfileVersionMetadata[] = [
      {
        id: 'v3',
        versionNumber: 3,
        schemaVersion: 1,
        sourceType: 'MANUAL',
        createdAt: '2025-03-10T14:30:00.000Z',
        isCurrent: true,
      } as ProfileVersionMetadata,
      {
        id: 'v1',
        versionNumber: 1,
        schemaVersion: 1,
        sourceType: 'MANUAL',
        createdAt: '2025-03-08T14:30:00.000Z',
        isCurrent: false,
      } as ProfileVersionMetadata,
    ];
    vi.spyOn(api.profiles, 'listVersions').mockResolvedValue(versions);
    vi.spyOn(api.profiles, 'getVersion').mockResolvedValue({
      profileId: PROFILE_ID,
      name: 'Test',
      version: versions[1],
      profile: makeSnapshot().profile,
    } as any);
    const activateSpy = vi
      .spyOn(api.profiles, 'activateVersion')
      .mockResolvedValue(
        makeSnapshot({ currentVersion: 4 } as Partial<ProfileSnapshot>),
      );
    const qc = createWrapper();
    renderPage([`/profile/${PROFILE_ID}`], qc);
    await screen.findByText(/versions/i);
    const user = userEvent.setup();
    await user.click(
      screen.getAllByRole('button', { name: /preview/i })[1] ??
        screen.getAllByRole('button', { name: /preview/i })[0],
    );
    await screen.findByText(/previewing version 1/i);
    await user.click(
      screen.getByRole('button', { name: /activate version 1/i }),
    );
    await user.click(screen.getByRole('button', { name: /^confirm$/i }));
    await waitFor(() => expect(activateSpy).toHaveBeenCalledTimes(1));
    expect(activateSpy).toHaveBeenCalledWith(PROFILE_ID, 1);
    // ensure not called with object
    expect(activateSpy.mock.calls[0][1]).toBe(1);
  });
});
