import { Button, Card, Typography, Space, App as AntApp } from 'antd';
import { useAuthStore } from '../../store/auth';

const Home = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { message } = AntApp.useApp();

  const handleLogout = async () => {
    try {
      await logout();
      message.success('Logged out');
    } catch {
      message.error('Logout failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Space direction="vertical" size="large" className="w-full">
        <Typography.Title level={2}>Talentor</Typography.Title>
        <Card>
          <Typography.Paragraph>
            Welcome, <strong>{user?.username ?? 'user'}</strong> ({user?.email})
          </Typography.Paragraph>
          <Typography.Text type="secondary">Role: {user?.role}</Typography.Text>
        </Card>
        <Button onClick={handleLogout}>Log out</Button>
      </Space>
    </div>
  );
};

export default Home;
