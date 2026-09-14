import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import type { components } from '@talentor/contracts';
import { profileKeys } from '@/features/profile/profile.api';

type ProfileSnapshot = components['schemas']['ProfileSnapshot'];

const mockNavigate = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock('sonner', async () => {
  const actual = await vi.importActual<typeof import('sonner')>('sonner');
  return {
    ...actual,
    toast: {
      success: (...args: unknown[]) => mockToastSuccess(...args),
      error: (...args: unknown[]) => mockToastError(...args),
    },
  };
});

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockResumeImportPageProps = vi.fn();

vi.mock('./ResumeImportPage', () => ({
  default: (props: {
    onCreated: (s: ProfileSnapshot) => void;
    onError: (m: string) => void;
  }) => {
    mockResumeImportPageProps(props);
    return (
      <div>
        <div>resume import page mock</div>
        <button
          type="button"
          onClick={() =>
            props.onCreated({
              id: 'snap-123',
              name: 'Imported',
              currentVersion: 1,
              createdAt: '2025-01-01T00:00:00.000Z',
              updatedAt: '2025-01-01T00:00:00.000Z',
              profile: {
                schemaVersion: 1,
                locale: 'en-US',
                personalInfo: {
                  fullName: 'Ada',
                  email: 'ada@example.com',
                  links: [],
                },
                experience: [],
                skills: [],
                languages: [],
                education: [],
                projects: [],
                certifications: [],
              },
            } as unknown as ProfileSnapshot)
          }
        >
          trigger created
        </button>
        <button type="button" onClick={() => props.onError('Something failed')}>
          trigger error
        </button>
      </div>
    );
  },
}));

import ResumeImportRoute from './ResumeImportRoute';

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
  return { qc, Wrapper };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockResumeImportPageProps.mockClear();
});

describe('ResumeImportRoute', () => {
  it('renders ResumeImportPage', () => {
    const { Wrapper } = createWrapper();
    render(<ResumeImportRoute />, { wrapper: Wrapper });
    expect(screen.getByText('resume import page mock')).toBeInTheDocument();
    expect(mockResumeImportPageProps).toHaveBeenCalledTimes(1);
    const props = mockResumeImportPageProps.mock.calls[0][0] as {
      onCreated: unknown;
      onError: unknown;
    };
    expect(typeof props.onCreated).toBe('function');
    expect(typeof props.onError).toBe('function');
  });

  it('onCreated sets cache, invalidates, toasts and navigates', async () => {
    const { qc, Wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(qc, 'invalidateQueries');
    const setSpy = vi.spyOn(qc, 'setQueryData');

    render(<ResumeImportRoute />, { wrapper: Wrapper });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /trigger created/i }));

    await waitFor(() =>
      expect(mockToastSuccess).toHaveBeenCalledWith(
        'Profile created from resume.',
      ),
    );
    expect(mockNavigate).toHaveBeenCalledWith('/profile/snap-123');

    expect(setSpy).toHaveBeenCalledWith(
      profileKeys.detail('snap-123'),
      expect.objectContaining({ id: 'snap-123' }),
    );
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: profileKeys.lists(),
    });

    const cached = qc.getQueryData<ProfileSnapshot>(
      profileKeys.detail('snap-123'),
    );
    expect(cached?.id).toBe('snap-123');
  });

  it('onError toasts error', async () => {
    const { Wrapper } = createWrapper();
    render(<ResumeImportRoute />, { wrapper: Wrapper });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /trigger error/i }));
    expect(mockToastError).toHaveBeenCalledWith('Something failed');
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
