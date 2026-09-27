import { Icons } from '@/components/Icons';
import { useUserMenu } from '../hooks/useUserMenu';

export function UserMenu() {
  const { displayName, displayEmail, initial, handleLogout, user } =
    useUserMenu();

  return (
    <div
      className="flex flex-col gap-3"
      aria-label="User menu"
      data-testid="dashboard-user-menu"
    >
      <div className="flex items-center gap-3 rounded-lg bg-white/[0.06] p-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
          aria-hidden="true"
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-sm font-medium leading-none"
            data-testid="dashboard-user-name"
          >
            {displayName}
          </p>
          {displayEmail ? (
            <p
              className="truncate text-xs text-muted-foreground"
              data-testid="dashboard-user-email"
            >
              {displayEmail}
            </p>
          ) : null}
          {user?.role ? (
            <p className="truncate text-[11px] uppercase tracking-widest text-white/60">
              {user.role}
            </p>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={() => void handleLogout()}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Log out"
        data-testid="dashboard-logout-button"
      >
        <Icons type="logout" aria-hidden="true" className="h-4 w-4" />
        Log out
      </button>
    </div>
  );
}
