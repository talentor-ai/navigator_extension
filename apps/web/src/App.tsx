import { Layout } from 'antd';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

const App = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Content style={{ padding: 24 }}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout.Content>
    </Layout>
  );
};

export default App;
