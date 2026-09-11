import { Card, Space, Typography } from 'antd';
import { useAuthStore } from '@/store/auth';

export default function DashboardHome() {
  const user = useAuthStore((state) => state.user);

  return (
    <div
      className="mx-auto max-w-2xl"
      data-testid="dashboard-home"
      aria-label="Dashboard home"
    >
      <Space direction="vertical" size="large" className="w-full">
        <Typography.Title level={2}>Dashboard</Typography.Title>
        <Card>
          <Typography.Paragraph>
            Welcome, <strong>{user?.username ?? 'user'}</strong>{' '}
            {user?.email ? `(${user.email})` : null}
          </Typography.Paragraph>
          <Typography.Text type="secondary">
            Role: {user?.role ?? 'USER'}
          </Typography.Text>
        </Card>
      </Space>
    </div>
  );
}
