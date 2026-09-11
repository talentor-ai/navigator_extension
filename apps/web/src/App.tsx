import { useEffect } from 'react';
import { ConfigProvider, App as AntApp } from 'antd';
import { Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/auth';
import { ProfilePage } from '@/features/profile';
import { ProfilesPage } from '@/features/profiles';
import { DashboardHome, DashboardLayout } from '@/features/dashboard';

const App = () => {
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === 'loading') {
      void bootstrap();
    }
  }, [bootstrap, status]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ffffff',
          colorPrimaryBg: '#262626',
          colorPrimaryText: '#ffffff',
          colorBgContainer: '#141414',
          colorBgLayout: '#090909',
          colorBgElevated: '#1a1a1a',
          colorText: '#f5f5f5',
          colorTextSecondary: '#a3a3a3',
          colorLink: '#f5f5f5',
          colorLinkHover: '#ffffff',
          colorLinkActive: '#d4d4d4',
          colorInfo: '#a3a3a3',
          colorInfoBg: '#262626',
          colorInfoBorder: '#404040',
          colorBorder: '#404040',
          colorBorderSecondary: '#262626',
          colorFillAlter: '#1a1a1a',
        },
      }}
    >
      <AntApp>
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="profiles" element={<ProfilesPage />} />
            <Route path="profile/:profileId?" element={<ProfilePage />} />
          </Route>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
        </Routes>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;
