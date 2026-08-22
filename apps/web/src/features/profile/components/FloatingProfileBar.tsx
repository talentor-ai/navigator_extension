import { Link, useLocation } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { useAuthStore } from '@/store/auth';

const FloatingProfileBar = () => {
  const logout = useAuthStore((s) => s.logout);
  const { pathname } = useLocation();
  const isProfile = pathname === '/profile' || pathname.startsWith('/profile/');

  return (
    <Tooltip.Provider>
      <nav
        aria-label="Profile navigation"
        className="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-card/80 px-2 py-1 shadow-lg backdrop-blur"
      >
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Link
              to="/"
              aria-label="Home"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4"
            >
              <Icons type="home" className="h-4 w-4" />
            </Link>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              sideOffset={6}
              className="rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow"
            >
              Home
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Link
              to="/profile"
              aria-label="Profile"
              aria-current={isProfile ? 'page' : undefined}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4 ${isProfile ? 'bg-secondary text-secondary-foreground' : ''}`}
            >
              <Icons type="profile" className="h-4 w-4" />
            </Link>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              sideOffset={6}
              className="rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow"
            >
              Profile
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Logout"
              onClick={() => void logout()}
            >
              <Icons type="logout" className="h-4 w-4" />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              sideOffset={6}
              className="rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow"
            >
              Logout
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </nav>
    </Tooltip.Provider>
  );
};

export default FloatingProfileBar;
