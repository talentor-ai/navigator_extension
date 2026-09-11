import type { IconType } from '@/components/Icons/types';

export type DashboardMenuItem = {
  id: string;
  label: string;
  to: string;
  icon: IconType;
  end?: boolean;
  /** Extra path prefixes that keep this item highlighted (e.g. child routes). */
  matchPrefixes?: string[];
};

export const DASHBOARD_MENU_ITEMS: DashboardMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', to: '/', icon: 'home', end: true },
  {
    id: 'profiles',
    label: 'Profiles',
    to: '/profiles',
    icon: 'profile',
    matchPrefixes: ['/profiles', '/profile'],
  },
];

export const DASHBOARD_BRAND_TITLE = 'Mr. Talentor';
