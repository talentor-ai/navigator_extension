import { useEffect } from 'react';
import { ConfigProvider, Layout, App as AntApp } from 'antd';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/auth';
import { ProfilePage } from '@/features/profile';

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
          colorPrimary: '#f2dc6b',
          colorBgContainer: '#FFFFFF0D',
          colorBgLayout: '#123159',
          colorBgElevated: '#1a3a6a',
          colorText: '#f2f2f2',
          colorTextSecondary: '#f2f2f2bf',
          colorBorder: '#FFFFFF1F',
          colorBorderSecondary: '#FFFFFF14',
          colorFillAlter: '#FFFFFF0D',
        },
      }}
    >
      <AntApp>
        <Layout className="min-h-screen">
          <Layout.Content className="p-6">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:profileId?"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
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
          </Layout.Content>
        </Layout>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;
