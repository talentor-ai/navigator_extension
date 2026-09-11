import { Outlet } from 'react-router-dom';
import { Icons } from '@/components/Icons';
import { Sidebar } from './components/Sidebar';
import { useDashboardLayout } from './hooks/useDashboardLayout';
import { DASHBOARD_BRAND_TITLE } from './constants';

export function DashboardLayout() {
  const { isMobileMenuOpen, closeMenu, toggleMenu } = useDashboardLayout();

  return (
    <div
      className="flex h-dvh max-h-dvh overflow-hidden bg-background text-foreground"
      data-testid="dashboard-layout"
    >
      <aside
        className="hidden h-dvh w-64 min-h-0 shrink-0 flex-col border-r border-border bg-background md:flex"
        aria-label="Sidebar"
        data-testid="dashboard-sidebar-desktop"
      >
        <Sidebar />
      </aside>

      <div className="flex h-dvh min-h-0 flex-1 flex-col">
        <header
          className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:hidden"
          data-testid="dashboard-mobile-header"
        >
          <span className="text-sm font-semibold tracking-tight">
            {DASHBOARD_BRAND_TITLE}
          </span>
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={
              isMobileMenuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-drawer"
            data-testid="dashboard-mobile-toggle"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icons
              type={isMobileMenuOpen ? 'close' : 'menu'}
              aria-hidden="true"
              className="h-5 w-5"
            />
          </button>
        </header>

        <main
          id="main-content"
          className="min-h-0 flex-1 overflow-y-auto bg-background p-4 md:p-6"
          data-testid="dashboard-main"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>

      {isMobileMenuOpen ? (
        <div
          className="fixed inset-0 z-50 md:hidden"
          data-testid="dashboard-mobile-drawer-root"
        >
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMenu}
            data-testid="dashboard-mobile-backdrop"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            data-testid="dashboard-mobile-drawer"
            className="absolute left-0 top-0 flex h-dvh max-h-dvh w-72 max-w-[80vw] flex-col border-r border-border bg-background shadow-xl"
          >
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <span className="text-sm font-semibold tracking-tight">
                {DASHBOARD_BRAND_TITLE}
              </span>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close navigation menu"
                data-testid="dashboard-mobile-close"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icons type="close" aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Sidebar onNavigate={closeMenu} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default DashboardLayout;
