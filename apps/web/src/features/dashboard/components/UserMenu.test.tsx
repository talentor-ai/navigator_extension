import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App as AntApp } from 'antd';

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

import { UserMenu } from './UserMenu';
import { useAuthStore } from '@/store/auth';

describe('UserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      status: 'authenticated',
      user: {
        id: '1',
        email: 'test@example.com',
        username: 'tester',
        accountVerified: true,
        role: 'USER',
        createdAt: '',
        updatedAt: '',
      },
    });
  });

  const renderMenu = () =>
    render(
      <AntApp>
        <UserMenu />
      </AntApp>,
    );

  it('renders user name, email and initial', () => {
    renderMenu();
    expect(screen.getByTestId('dashboard-user-menu')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-user-name')).toHaveTextContent(
      'tester',
    );
    expect(screen.getByTestId('dashboard-user-email')).toHaveTextContent(
      'test@example.com',
    );
    // initial is first char uppercase
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('USER')).toBeInTheDocument();
  });

  it('falls back to User when no username', () => {
    useAuthStore.setState({
      status: 'anonymous',
      user: null,
    });
    renderMenu();
    expect(screen.getByTestId('dashboard-user-name')).toHaveTextContent('User');
  });

  it('renders logout button with aria-label and icon', () => {
    renderMenu();
    const btn = screen.getByTestId('dashboard-logout-button');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-label', 'Log out');
    expect(btn).toHaveTextContent('Log out');
    expect(btn.querySelector('svg')).toBeInTheDocument();
  });

  it('calls logout on click (user menu logout behavior)', async () => {
    const user = userEvent.setup();
    const logoutSpy = vi
      .spyOn(useAuthStore.getState(), 'logout')
      .mockResolvedValue(undefined as never);

    renderMenu();
    await user.click(screen.getByTestId('dashboard-logout-button'));
    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });

  it('handles logout rejection without throwing', async () => {
    const user = userEvent.setup();
    const logoutSpy = vi
      .spyOn(useAuthStore.getState(), 'logout')
      .mockRejectedValue(new Error('network'));

    renderMenu();
    await user.click(screen.getByTestId('dashboard-logout-button'));
    expect(logoutSpy).toHaveBeenCalledTimes(1);
    // UserMenu component catches error and shows message.error, but does not throw
    expect(screen.getByTestId('dashboard-logout-button')).toBeInTheDocument();
  });

  it('has accessible user menu landmark', () => {
    renderMenu();
    expect(screen.getByLabelText('User menu')).toBeInTheDocument();
  });
});
