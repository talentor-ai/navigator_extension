import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

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

import FloatingProfileBar from './FloatingProfileBar';
import { useAuthStore } from '@/store/auth';

describe('FloatingProfileBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      status: 'authenticated',
      user: {
        id: '1',
        email: 'a@b.com',
        username: 'user',
        accountVerified: false,
        role: 'USER',
        createdAt: '',
        updatedAt: '',
      },
    });
  });

  it('renders profile navigation with home, profile and logout', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <FloatingProfileBar />
      </MemoryRouter>,
    );

    const nav = screen.getByLabelText('Profile navigation');
    expect(nav).toBeInTheDocument();
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Logout')).toBeInTheDocument();
  });

  it('home link points to root', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <FloatingProfileBar />
      </MemoryRouter>,
    );
    const home = screen.getByLabelText('Home');
    expect(home.closest('a')).toHaveAttribute('href', '/');
  });

  it('profile link points to /profile and reflects active state', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/profile']}>
        <FloatingProfileBar />
      </MemoryRouter>,
    );
    const profileOnProfile = screen.getByLabelText('Profile');
    expect(profileOnProfile.closest('a')).toHaveAttribute('href', '/profile');
    expect(profileOnProfile).toHaveAttribute('aria-current', 'page');
    unmount();

    render(
      <MemoryRouter initialEntries={['/']}>
        <FloatingProfileBar />
      </MemoryRouter>,
    );
    const profileOnHome = screen.getByLabelText('Profile');
    expect(profileOnHome).not.toHaveAttribute('aria-current');
  });

  it('profile link active for nested profile route', () => {
    render(
      <MemoryRouter
        initialEntries={['/profile/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11']}
      >
        <FloatingProfileBar />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Profile')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('logout button calls auth store logout', async () => {
    const user = userEvent.setup();
    const logoutSpy = vi
      .spyOn(useAuthStore.getState(), 'logout')
      .mockImplementation(() => Promise.resolve());

    render(
      <MemoryRouter initialEntries={['/']}>
        <FloatingProfileBar />
      </MemoryRouter>,
    );

    await user.click(screen.getByLabelText('Logout'));
    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });

  it('logout failure still invokes logout (fire-and-forget void)', async () => {
    const user = userEvent.setup();
    const logoutSpy = vi
      .spyOn(useAuthStore.getState(), 'logout')
      .mockRejectedValue(new Error('network'));

    render(
      <MemoryRouter initialEntries={['/']}>
        <FloatingProfileBar />
      </MemoryRouter>,
    );

    await user.click(screen.getByLabelText('Logout'));
    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });

  it('is fixed top-center with backdrop and pill styling', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <FloatingProfileBar />
      </MemoryRouter>,
    );
    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('fixed');
    expect(nav?.className).toContain('rounded-full');
    expect(nav?.className).toContain('backdrop-blur');
  });
});
