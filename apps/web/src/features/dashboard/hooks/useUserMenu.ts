import { useCallback } from 'react';
import { App as AntApp } from 'antd';
import { useAuthStore } from '@/store/auth';

export function useUserMenu() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { message } = AntApp.useApp();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      message.success('Logged out');
    } catch {
      message.error('Logout failed');
    }
  }, [logout, message]);

  const displayName = user?.username ?? 'User';
  const displayEmail = user?.email ?? '';
  const initial = displayName.charAt(0).toUpperCase() || 'U';

  return {
    user,
    displayName,
    displayEmail,
    initial,
    handleLogout,
  };
}
