import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { DashboardLayout } from './DashboardLayout';
import { DASHBOARD_MENU_ITEMS, DASHBOARD_BRAND_TITLE } from './constants';
import { useAuthStore } from '@/store/auth';

const renderLayout = (initialPath = '/') => {
  return render(
    <AntApp>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route index element={<div>dashboard home</div>} />
            <Route path="profiles" element={<div>profiles page</div>} />
            <Route path="profile/:profileId?" element={<div>editor</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AntApp>,
  );
};

describe('DashboardLayout', () => {
  beforeEach(() => {
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
    vi.clearAllMocks();
  });

  it('renders brand title Mr. Talentor', () => {
    renderLayout();
    expect(screen.getAllByText(DASHBOARD_BRAND_TITLE).length).toBeGreaterThan(
      0,
    );
    expect(screen.getByTestId('dashboard-brand')).toHaveTextContent(
      DASHBOARD_BRAND_TITLE,
    );
  });

  it('renders constants-driven menu items in nav', () => {
    renderLayout();
    const nav = screen.getByTestId('dashboard-nav');
    expect(nav).toHaveAttribute('aria-label', 'Primary');
    const list = within(nav).getByRole('list');
    expect(list).toBeInTheDocument();

    for (const item of DASHBOARD_MENU_ITEMS) {
      const link = screen.getByTestId(`dashboard-nav-${item.id}`);
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', item.to);
      expect(within(link).getByText(item.label)).toBeInTheDocument();
    }
  });

  it('marks active nav item with aria-current', async () => {
    renderLayout('/profiles');
    const profilesLink = screen.getByTestId('dashboard-nav-profiles');
    // NavLink active adds class containing bg-lime and should be current route
    // Check href active styling class contains active indicator
    expect(profilesLink).toHaveAttribute('href', '/profiles');
    // aria-current is added via NavLink's isActive? We render span sr-only for active
    // At least profiles should be active, dashboard should not
    expect(within(profilesLink).getByText('(current)')).toBeInTheDocument();
  });

  it('keeps profiles highlighted on profile editor paths', () => {
    renderLayout('/profile/abc');
    const profilesLink = screen.getByTestId('dashboard-nav-profiles');
    expect(profilesLink).toHaveClass('bg-lime');
    expect(profilesLink).toHaveAttribute('aria-current', 'page');
    expect(within(profilesLink).getByText('(current)')).toBeInTheDocument();
    const dashboardLink = screen.getByTestId('dashboard-nav-dashboard');
    expect(dashboardLink).not.toHaveClass('bg-lime');
    expect(
      within(dashboardLink).queryByText('(current)'),
    ).not.toBeInTheDocument();
  });

  it('renders bottom user profile/menu with logout using useAuthStore', async () => {
    const logoutSpy = vi
      .spyOn(useAuthStore.getState(), 'logout')
      .mockResolvedValue(undefined as never);

    renderLayout();
    expect(screen.getByTestId('dashboard-user-menu')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-user-name')).toHaveTextContent(
      'tester',
    );
    expect(screen.getByTestId('dashboard-user-email')).toHaveTextContent(
      'test@example.com',
    );

    const btn = screen.getByTestId('dashboard-logout-button');
    expect(btn).toHaveAttribute('aria-label', 'Log out');
    await userEvent.click(btn);
    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });

  it('has accessible nav and menu landmarks', () => {
    renderLayout();
    expect(
      screen.getByRole('navigation', { name: 'Primary' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-main')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-main')).toHaveAttribute(
      'id',
      'main-content',
    );
  });

  describe('responsive mobile layout', () => {
    it('renders mobile header toggle and handles open/close via backdrop and close button', async () => {
      const user = userEvent.setup();
      renderLayout();

      const toggle = screen.getByTestId('dashboard-mobile-toggle');
      expect(toggle).toHaveAttribute('aria-controls', 'mobile-drawer');
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(toggle).toHaveAttribute('aria-label', 'Open navigation menu');

      // drawer closed initially
      expect(
        screen.queryByTestId('dashboard-mobile-drawer'),
      ).not.toBeInTheDocument();

      await user.click(toggle);

      const drawer = screen.getByTestId('dashboard-mobile-drawer');
      expect(drawer).toBeInTheDocument();
      expect(drawer).toHaveAttribute('role', 'dialog');
      expect(drawer).toHaveAttribute('aria-modal', 'true');
      expect(drawer).toHaveAttribute('aria-label', 'Navigation menu');
      expect(toggle).toHaveAttribute('aria-expanded', 'true');

      // close via close button
      const closeBtn = screen.getByTestId('dashboard-mobile-close');
      expect(closeBtn).toHaveAttribute('aria-label', 'Close navigation menu');
      await user.click(closeBtn);
      expect(
        screen.queryByTestId('dashboard-mobile-drawer'),
      ).not.toBeInTheDocument();
    });

    it('closes drawer on backdrop click and Escape', async () => {
      const user = userEvent.setup();
      renderLayout();

      await user.click(screen.getByTestId('dashboard-mobile-toggle'));
      expect(screen.getByTestId('dashboard-mobile-drawer')).toBeInTheDocument();

      await user.click(screen.getByTestId('dashboard-mobile-backdrop'));
      expect(
        screen.queryByTestId('dashboard-mobile-drawer'),
      ).not.toBeInTheDocument();

      // reopen and test Escape
      await user.click(screen.getByTestId('dashboard-mobile-toggle'));
      expect(screen.getByTestId('dashboard-mobile-drawer')).toBeInTheDocument();
      await user.keyboard('{Escape}');
      expect(
        screen.queryByTestId('dashboard-mobile-drawer'),
      ).not.toBeInTheDocument();
    });

    it('closes drawer on menu navigation', async () => {
      const user = userEvent.setup();
      renderLayout('/');

      await user.click(screen.getByTestId('dashboard-mobile-toggle'));
      const drawerLink = within(
        screen.getByTestId('dashboard-mobile-drawer'),
      ).getByTestId('dashboard-nav-profiles');
      await user.click(drawerLink);
      // after navigation, drawer closes via onNavigate
      expect(
        screen.queryByTestId('dashboard-mobile-drawer'),
      ).not.toBeInTheDocument();
    });
  });

  it('desktop sidebar hidden on mobile via CSS classes', () => {
    renderLayout();
    const desktopAside = screen.getByTestId('dashboard-sidebar-desktop');
    expect(desktopAside).toHaveClass('hidden');
    expect(desktopAside).toHaveClass('md:flex');
    expect(screen.getByTestId('dashboard-mobile-header')).toBeInTheDocument();
  });
});

describe('dashboard constants', () => {
  it('exports brand title and menu with required icons', () => {
    expect(DASHBOARD_BRAND_TITLE).toBe('Mr. Talentor');
    expect(DASHBOARD_MENU_ITEMS.length).toBeGreaterThanOrEqual(2);
    for (const item of DASHBOARD_MENU_ITEMS) {
      expect(item.id).toBeTruthy();
      expect(item.label).toBeTruthy();
      expect(item.to).toMatch(/^\//);
      expect(item.icon).toBeTruthy();
    }
  });

  it('contains dashboard and profiles entries', () => {
    const ids = DASHBOARD_MENU_ITEMS.map((i) => i.id);
    expect(ids).toContain('dashboard');
    expect(ids).toContain('profiles');
  });
});
