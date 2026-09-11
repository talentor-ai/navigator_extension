import { describe, it, expect } from 'vitest';
import { DASHBOARD_MENU_ITEMS, DASHBOARD_BRAND_TITLE } from './constants';
import { ICON_COMPONENTS } from '@/components/Icons/constants';

describe('dashboard constants', () => {
  it('exports brand title', () => {
    expect(DASHBOARD_BRAND_TITLE).toBe('Mr. Talentor');
    expect(typeof DASHBOARD_BRAND_TITLE).toBe('string');
    expect(DASHBOARD_BRAND_TITLE.length).toBeGreaterThan(0);
  });

  it('menu has dashboard and profiles items', () => {
    expect(DASHBOARD_MENU_ITEMS).toHaveLength(2);
    const ids = DASHBOARD_MENU_ITEMS.map((i) => i.id);
    expect(ids).toEqual(['dashboard', 'profiles']);
  });

  it('dashboard item points to root with end', () => {
    const dash = DASHBOARD_MENU_ITEMS.find((i) => i.id === 'dashboard')!;
    expect(dash.label).toBe('Dashboard');
    expect(dash.to).toBe('/');
    expect(dash.icon).toBe('home');
    expect(dash.end).toBe(true);
  });

  it('profiles item points to /profiles', () => {
    const profiles = DASHBOARD_MENU_ITEMS.find((i) => i.id === 'profiles')!;
    expect(profiles.label).toBe('Profiles');
    expect(profiles.to).toBe('/profiles');
    expect(profiles.icon).toBe('profile');
    expect(profiles.end).toBeUndefined();
  });

  it('menu shape has required fields and valid icons', () => {
    for (const item of DASHBOARD_MENU_ITEMS) {
      expect(item.id).toMatch(/^[a-z-]+$/);
      expect(item.label).toBeTruthy();
      expect(item.to).toMatch(/^\//);
      expect(item.icon in ICON_COMPONENTS).toBe(true);
    }
  });

  it('to values are unique', () => {
    const tos = DASHBOARD_MENU_ITEMS.map((i) => i.to);
    expect(new Set(tos).size).toBe(tos.length);
  });

  it('ids are unique', () => {
    const ids = DASHBOARD_MENU_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
