import { HashRouter as RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Router } from './routes';
import { BaseLayout } from './components';
import '@popup/app.css';
import '@popup/lang/i18n';
import Header from './containers/Header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorBgBase: '#2b2b37',
            colorBorder: 'transparent',
            colorPrimaryHover: '#fcaf58',
            colorErrorOutline: '#fb4c69',
            controlOutline: 'transparent',
            colorText: '#f5f5f5',
            colorTextPlaceholder: '#8e8e8e',
            colorTextDisabled: '#8e8e8e',
            colorPrimaryBg: '#fcaf58',
            sizeLG: 32,
          },
        }}
      >
        <RouterProvider
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <BaseLayout>
            <Header />
            <Router />
          </BaseLayout>
        </RouterProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
