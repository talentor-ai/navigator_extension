import { HashRouter as RouterProvider } from 'react-router-dom';
import { Router } from './routes';
import { BaseLayout } from './components';
import '@popup/app.css';
import Header from './containers/Header';

const App = () => {
  return (
    <RouterProvider
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <BaseLayout>
        <Header />
        <Router />
      </BaseLayout>
    </RouterProvider>
  );
};

export default App;
