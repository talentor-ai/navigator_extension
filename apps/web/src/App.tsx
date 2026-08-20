import { useEffect } from 'react';
import { Layout, App as AntApp } from 'antd';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/auth';

const App = () => {
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === 'loading') {
      void bootstrap();
    }
  }, [bootstrap, status]);

  return (
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
  );
};

export default App;
