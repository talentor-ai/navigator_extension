import { Link, useLocation } from 'react-router-dom';
import { Icons } from '@/components/Icons';
import { Separator } from '@/components/ui/separator';
import {
  DASHBOARD_BRAND_TITLE,
  DASHBOARD_MENU_ITEMS,
  type DashboardMenuItem,
} from '../constants';
import { UserMenu } from './UserMenu';

type SidebarProps = {
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  const { pathname } = useLocation();

  const isPathMatch = (item: DashboardMenuItem) => {
    const prefixes = item.matchPrefixes ?? [item.to];
    return prefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
  };

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden bg-background"
      data-testid="dashboard-sidebar"
    >
      <div className="flex h-16 shrink-0 items-center px-6">
        <span
          className="text-base font-semibold tracking-tight"
          data-testid="dashboard-brand"
        >
          {DASHBOARD_BRAND_TITLE}
        </span>
      </div>

      <Separator decorative />

      <nav
        aria-label="Primary"
        className="min-h-0 flex-1 overflow-y-auto px-3 py-4"
        data-testid="dashboard-nav"
      >
        <ul role="list" className="space-y-1">
          {DASHBOARD_MENU_ITEMS.map((item) => {
            const isCurrent = isPathMatch(item);
            return (
              <li key={item.id}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  data-testid={`dashboard-nav-${item.id}`}
                  aria-label={item.label}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={[
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isCurrent
                      ? 'bg-lime text-lime-foreground'
                      : 'text-white/70 hover:bg-white/[0.06] hover:text-foreground',
                  ].join(' ')}
                >
                  <Icons
                    type={item.icon}
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0"
                  />
                  <span>{item.label}</span>
                  {isCurrent ? (
                    <span className="sr-only"> (current)</span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator decorative />

      <div className="p-3">
        <UserMenu />
      </div>
    </div>
  );
}
