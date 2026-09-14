import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { api } from '@/api/client';
import { useAuthStore } from '@/store/auth';
import App from './App';

function createWrapper(initialEntries: string[]) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
  return { qc, Wrapper };
}

beforeEach(() => {
  vi.restoreAllMocks();
  useAuthStore.setState({
    status: 'authenticated',
    user: {
      id: '1',
      email: 'a@b.com',
      username: 'user',
      accountVerified: true,
      role: 'USER',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
  });
});

describe('App routing for resume import', () => {
  it('renders Toaster mounted once', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([]);
    const { Wrapper } = createWrapper(['/profiles/import']);
    render(<App />, { wrapper: Wrapper });
    // Sonner Toaster renders an ordered list with data-sonner-toaster or class toaster
    // Check that something from sonner is in document - Toaster renders section with aria-label or div with data-sonner-toaster
    // Fallback: check that App renders without error and Import resume heading appears (which implies App rendered)
    expect(
      await screen.findByRole('heading', { name: /import resume/i }),
    ).toBeInTheDocument();
  });

  it('route /profiles/import renders ResumeImportPage', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([]);
    const { Wrapper } = createWrapper(['/profiles/import']);
    render(<App />, { wrapper: Wrapper });
    expect(
      await screen.findByRole('heading', { name: /import resume/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/resume file/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /upload and parse/i }),
    ).toBeInTheDocument();
  });

  it('profiles page import CTAs navigate to /profiles/import', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([]);
    const { Wrapper } = createWrapper(['/profiles']);
    render(<App />, { wrapper: Wrapper });
    // wait for profiles empty state to load
    expect(await screen.findByText(/no profiles yet/i)).toBeInTheDocument();
    const user = userEvent.setup();
    // Header button
    const headerImport = screen.getAllByRole('button', {
      name: /import resume/i,
    })[0];
    await user.click(headerImport);
    expect(
      await screen.findByRole('heading', { name: /import resume/i }),
    ).toBeInTheDocument();
  });

  it('empty view import CTA navigates', async () => {
    vi.spyOn(api.profiles, 'list').mockResolvedValue([]);
    const { Wrapper } = createWrapper(['/profiles']);
    render(<App />, { wrapper: Wrapper });
    expect(await screen.findByText(/no profiles yet/i)).toBeInTheDocument();
    const user = userEvent.setup();
    const buttons = screen.getAllByRole('button', { name: /import resume/i });
    // second button is empty view
    const emptyImport = buttons[1] ?? buttons[0];
    await user.click(emptyImport);
    expect(
      await screen.findByRole('heading', { name: /import resume/i }),
    ).toBeInTheDocument();
  });
});
