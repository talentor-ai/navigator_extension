import { HashRouter as RouterProvider } from 'react-router-dom';
import { Router } from './routes';
import { BaseLayout } from './components';
import '@popup/app.css';
import Header from './containers/Header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BaseLayout>
          <Header />
          <Router />
        </BaseLayout>
      </RouterProvider>
    </QueryClientProvider>
  );
};

export default App;
