import { useState } from 'react';
import { Alert, Button, Form, Typography, App as AntApp } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { ApiError } from '@talentor/api-client';
import { Input } from '@/components/ui/input';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntApp.useApp();
  const login = useAuthStore((s) => s.login);
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const onFinish = async (values: { username: string; password: string }) => {
    setError(null);
    setLoading(true);
    try {
      await login(values);
      message.success('Logged in');
      navigate(from, { replace: true });
    } catch (e) {
      const err = e as ApiError;
      if (err.status === 401) {
        setError('Invalid username or password');
      } else if (err.status === 0) {
        setError('Unable to reach server');
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6">
      <Typography.Title level={2}>Log in</Typography.Title>
      {error && (
        <Alert type="error" message={error} className="mb-4" showIcon />
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: 'Username is required' },
            { min: 3, message: 'Username must be at least 3 characters' },
          ]}
        >
          <Input autoComplete="username" autoFocus />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Password is required' }]}
        >
          <Input type="password" autoComplete="current-password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Log in
          </Button>
        </Form.Item>
      </Form>
      <Typography.Paragraph>
        No account? <Link to="/register">Register</Link>
      </Typography.Paragraph>
    </div>
  );
};
