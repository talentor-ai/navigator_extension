import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { components } from '@talentor/contracts';

vi.mock('@/api/client', () => ({
  api: {
    auth: {
      login: vi.fn(),
      register: vi.fn(),
      refresh: vi.fn(),
      logout: vi.fn().mockResolvedValue(undefined),
      getSession: vi.fn(),
    },
    profiles: {
      list: vi.fn(),
      get: vi.fn(),
      listVersions: vi.fn(),
      getVersion: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      activateVersion: vi.fn(),
    },
    clearAuth: vi.fn(),
    getAccessToken: vi.fn(() => null),
    setAccessToken: vi.fn(),
  },
}));

// Mock VersionSwitcher lazy to avoid suspense flakiness for content view
vi.mock('./components/VersionSwitcher', () => ({
  default: (props: any) => (
    <div data-testid="mock-versions">
      <span>Current {props.currentVersion}</span>
      {props.previewVersion !== null && (
        <span>Preview {props.previewVersion}</span>
      )}
      {props.error && <div role="alert">{props.error}</div>}
      <ul aria-label="Profile versions">
        {props.versions?.map((v: any) => (
          <li key={v.id}>Version {v.versionNumber}</li>
        ))}
      </ul>
      <button onClick={() => props.onPreview(1)}>mock preview</button>
      <button onClick={() => props.onActivate(1)}>mock activate</button>
      <button onClick={props.onExitPreview}>mock exit</button>
    </div>
  ),
}));

import ProfilePageLoadingView from './components/ProfilePageLoadingView';
import ProfilePageEmptyView from './components/ProfilePageEmptyView';
import ProfilePageListErrorView from './components/ProfilePageListErrorView';
import ProfilePageSelectorErrorView from './components/ProfilePageSelectorErrorView';
import ProfilePageContentView from './components/ProfilePageContentView';
import ProfilePageEditorLayout from './components/ProfilePageEditorLayout';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];
type ProfileMetadata = components['schemas']['ProfileMetadata'];
type ProfileVersionMetadata = components['schemas']['ProfileVersionMetadata'];

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
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
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
    baseSummary: 'summary here',
    experience: [],
    skills: [],
    languages: [],
    education: [],
    projects: [],
    certifications: [],
  } as unknown as CandidateProfileV1;
  return { ...base, ...overrides } as CandidateProfileV1;
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

describe('ProfilePageLoadingView', () => {
  it('renders loading profile status with skeleton and nav', () => {
    render(
      <MemoryRouter>
        <ProfilePageLoadingView />
      </MemoryRouter>,
    );
    const status = screen.getByRole('status', { name: /loading profile/i });
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
    // floating bar present
    expect(screen.getByLabelText('Profile navigation')).toBeInTheDocument();
    // skeleton pulsing blocks
    const pulses = document.querySelectorAll('.animate-pulse');
    expect(pulses.length).toBeGreaterThan(10);
  });
});

describe('ProfilePageEmptyView', () => {
  it('renders empty state with create CTA', () => {
    const onCreate = vi.fn();
    render(
      <MemoryRouter>
        <ProfilePageEmptyView
          creating={false}
          createError={null}
          onCreate={onCreate}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText(/no profile yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create profile/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Profile navigation')).toBeInTheDocument();
  });

  it('shows creating state and disables button', () => {
    render(
      <MemoryRouter>
        <ProfilePageEmptyView creating createError={null} onCreate={vi.fn()} />
      </MemoryRouter>,
    );
    const btn = screen.getByRole('button', { name: /creating/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('shows createError alert when present', () => {
    render(
      <MemoryRouter>
        <ProfilePageEmptyView
          creating={false}
          createError="Duplicate name"
          onCreate={vi.fn()}
        />
      </MemoryRouter>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Duplicate name');
  });

  it('calls onCreate when create button clicked', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(
      <MemoryRouter>
        <ProfilePageEmptyView
          creating={false}
          createError={null}
          onCreate={onCreate}
        />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('button', { name: /create profile/i }));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('renders dialog slot when provided', () => {
    render(
      <MemoryRouter>
        <ProfilePageEmptyView
          creating={false}
          createError={null}
          onCreate={vi.fn()}
          dialog={<div data-testid="create-dialog">dialog</div>}
        />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('create-dialog')).toBeInTheDocument();
  });
});

describe('ProfilePageListErrorView', () => {
  it('renders error message with alert and retry', () => {
    const onRetry = vi.fn();
    render(
      <MemoryRouter>
        <ProfilePageListErrorView message="Network failed" onRetry={onRetry} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Network failed')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Network failed');
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Profile navigation')).toBeInTheDocument();
  });

  it('calls onRetry when retry clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <MemoryRouter>
        <ProfilePageListErrorView message="err" onRetry={onRetry} />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('button', { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('shows retrying state', () => {
    render(
      <MemoryRouter>
        <ProfilePageListErrorView message="err" onRetry={vi.fn()} retrying />
      </MemoryRouter>,
    );
    const btn = screen.getByRole('button', { name: /retrying/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('renders dialog slot', () => {
    render(
      <MemoryRouter>
        <ProfilePageListErrorView
          message="err"
          onRetry={vi.fn()}
          dialog={<div data-testid="err-dialog">d</div>}
        />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('err-dialog')).toBeInTheDocument();
  });
});

describe('ProfilePageSelectorErrorView', () => {
  const profiles = [makeMeta('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'First')];

  it('renders selector controls plus error', () => {
    render(
      <MemoryRouter>
        <ProfilePageSelectorErrorView
          profiles={profiles}
          profileId={profiles[0].id}
          onSelect={vi.fn()}
          onCreate={vi.fn()}
          message="Detail failed"
          onRetry={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('Detail failed')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Detail failed');
    expect(
      screen.getByRole('button', { name: /new profile/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Select profile')).toBeInTheDocument();
  });

  it('renders children slot (e.g. exit preview)', () => {
    render(
      <MemoryRouter>
        <ProfilePageSelectorErrorView
          profiles={profiles}
          profileId={profiles[0].id}
          onSelect={vi.fn()}
          onCreate={vi.fn()}
          message="err"
          onRetry={vi.fn()}
        >
          <button>Exit preview</button>
        </ProfilePageSelectorErrorView>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('button', { name: /exit preview/i }),
    ).toBeInTheDocument();
  });

  it('retry button triggers onRetry', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <MemoryRouter>
        <ProfilePageSelectorErrorView
          profiles={profiles}
          profileId={profiles[0].id}
          onSelect={vi.fn()}
          onCreate={vi.fn()}
          message="err"
          onRetry={onRetry}
        />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('button', { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

describe('ProfilePageContentView', () => {
  const profiles = [makeMeta('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'P1')];
  const profile = makeProfile();
  const versions: ProfileVersionMetadata[] = [
    {
      id: 'v1',
      versionNumber: 1,
      schemaVersion: 1,
      sourceType: 'MANUAL',
      createdAt: '2025-03-10T14:30:00.000Z',
      isCurrent: true,
    } as ProfileVersionMetadata,
  ];

  it('populated rendering shows selector, editor headings and versions', async () => {
    render(
      <MemoryRouter>
        <ProfilePageContentView
          profiles={profiles}
          profileId={profiles[0].id}
          onSelect={vi.fn()}
          onCreate={vi.fn()}
          saveError={null}
          versionsLoading={false}
          versions={versions}
          currentVersion={1}
          previewVersion={null}
          pendingVersion={null}
          combinedVersionError={null}
          onPreview={vi.fn()}
          onActivate={vi.fn()}
          onExitPreview={vi.fn()}
          profile={profile}
          pending={false}
          readOnly={false}
          onProfileChange={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText('Select profile')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /new profile/i }),
    ).toBeInTheDocument();
    // editor layout headings
    expect(
      screen.getByRole('heading', { name: 'Summary' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Contact' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Experience' }),
    ).toBeInTheDocument();
    // mocked version switcher renders
    expect(await screen.findByTestId('mock-versions')).toBeInTheDocument();
    expect(screen.getByText(/Current 1/)).toBeInTheDocument();
  });

  it('loading versions shows accessible status instead of version list', () => {
    render(
      <MemoryRouter>
        <ProfilePageContentView
          profiles={profiles}
          profileId={profiles[0].id}
          onSelect={vi.fn()}
          onCreate={vi.fn()}
          saveError={null}
          versionsLoading
          versions={[]}
          currentVersion={1}
          previewVersion={null}
          pendingVersion={null}
          combinedVersionError={null}
          onPreview={vi.fn()}
          onActivate={vi.fn()}
          onExitPreview={vi.fn()}
          profile={profile}
          pending={false}
          readOnly={false}
          onProfileChange={vi.fn()}
        />
      </MemoryRouter>,
    );
    const status = screen.getByRole('status', { name: /loading versions/i });
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent(/loading versions/i);
    expect(screen.queryByTestId('mock-versions')).not.toBeInTheDocument();
  });

  it('saveError shows alert', () => {
    render(
      <MemoryRouter>
        <ProfilePageContentView
          profiles={profiles}
          profileId={profiles[0].id}
          onSelect={vi.fn()}
          onCreate={vi.fn()}
          saveError="Save failed"
          versionsLoading={false}
          versions={[]}
          currentVersion={1}
          previewVersion={null}
          pendingVersion={null}
          combinedVersionError={null}
          onPreview={vi.fn()}
          onActivate={vi.fn()}
          onExitPreview={vi.fn()}
          profile={profile}
          pending={false}
          readOnly={false}
          onProfileChange={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Save failed');
  });

  it('combinedVersionError surfaces in version switcher alert', async () => {
    render(
      <MemoryRouter>
        <ProfilePageContentView
          profiles={profiles}
          profileId={profiles[0].id}
          onSelect={vi.fn()}
          onCreate={vi.fn()}
          saveError={null}
          versionsLoading={false}
          versions={versions}
          currentVersion={1}
          previewVersion={null}
          pendingVersion={null}
          combinedVersionError="Versions failed"
          onPreview={vi.fn()}
          onActivate={vi.fn()}
          onExitPreview={vi.fn()}
          profile={profile}
          pending={false}
          readOnly={false}
          onProfileChange={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(await screen.findByText('Versions failed')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Versions failed');
  });

  it('pending and readOnly propagate to editor (busy/disabled)', () => {
    const { rerender } = render(
      <MemoryRouter>
        <ProfilePageContentView
          profiles={profiles}
          profileId={profiles[0].id}
          onSelect={vi.fn()}
          onCreate={vi.fn()}
          saveError={null}
          versionsLoading={false}
          versions={[]}
          currentVersion={1}
          previewVersion={null}
          pendingVersion={null}
          combinedVersionError={null}
          onPreview={vi.fn()}
          onActivate={vi.fn()}
          onExitPreview={vi.fn()}
          profile={profile}
          pending
          readOnly={false}
          onProfileChange={vi.fn()}
        />
      </MemoryRouter>,
    );
    // pending shows aria-busy on editable displays (Summary Edit has busy)
    expect(screen.getByLabelText('Edit Summary')).toHaveAttribute(
      'aria-busy',
      'true',
    );

    rerender(
      <MemoryRouter>
        <ProfilePageContentView
          profiles={profiles}
          profileId={profiles[0].id}
          onSelect={vi.fn()}
          onCreate={vi.fn()}
          saveError={null}
          versionsLoading={false}
          versions={[]}
          currentVersion={1}
          previewVersion={1}
          pendingVersion={null}
          combinedVersionError={null}
          onPreview={vi.fn()}
          onActivate={vi.fn()}
          onExitPreview={vi.fn()}
          profile={profile}
          pending={false}
          readOnly
          onProfileChange={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Edit Summary')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('previewVersion propagates to version switcher', async () => {
    render(
      <MemoryRouter>
        <ProfilePageContentView
          profiles={profiles}
          profileId={profiles[0].id}
          onSelect={vi.fn()}
          onCreate={vi.fn()}
          saveError={null}
          versionsLoading={false}
          versions={versions}
          currentVersion={1}
          previewVersion={1}
          pendingVersion={null}
          combinedVersionError={null}
          onPreview={vi.fn()}
          onActivate={vi.fn()}
          onExitPreview={vi.fn()}
          profile={profile}
          pending={false}
          readOnly
          onProfileChange={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(await screen.findByText(/Preview 1/)).toBeInTheDocument();
  });
});

describe('ProfilePageEditorLayout', () => {
  it('renders two-column grid with main and aside sections', () => {
    const profile = makeProfile();
    const { container } = render(
      <MemoryRouter>
        <ProfilePageEditorLayout
          profile={profile}
          pending={false}
          readOnly={false}
          onProfileChange={vi.fn()}
        />
      </MemoryRouter>,
    );
    const grid = container.querySelector('.grid');
    expect(grid?.className).toContain('grid-cols-12');
    expect(container.querySelector('main')).toBeInTheDocument();
    expect(container.querySelector('aside')).toBeInTheDocument();
  });

  it('renders all section headings', () => {
    const profile = makeProfile();
    render(
      <MemoryRouter>
        <ProfilePageEditorLayout
          profile={profile}
          pending={false}
          readOnly={false}
          onProfileChange={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { name: 'Summary' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Experience' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Projects' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Contact' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Languages' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Education' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Certifications' }),
    ).toBeInTheDocument();
  });

  it('populated profile shows personal info and summary content', () => {
    const profile = makeProfile({ baseSummary: 'my summary' });
    render(
      <MemoryRouter>
        <ProfilePageEditorLayout
          profile={profile}
          pending={false}
          readOnly={false}
          onProfileChange={vi.fn()}
        />
      </MemoryRouter>,
    );
    // ProfileHeader shows fullName via EditableField display
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('my summary')).toBeInTheDocument();
  });

  it('empty collections show placeholder texts', () => {
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
    render(
      <MemoryRouter>
        <ProfilePageEditorLayout
          profile={empty}
          pending={false}
          readOnly={false}
          onProfileChange={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('No experience yet')).toBeInTheDocument();
    expect(screen.getByText('No skills yet')).toBeInTheDocument();
    expect(screen.getByText('No languages yet')).toBeInTheDocument();
  });
});
