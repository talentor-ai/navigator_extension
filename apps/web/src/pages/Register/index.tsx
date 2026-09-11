import { useState } from 'react';
import { Alert, Button, Form, Typography, App as AntApp } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { ApiError } from '@talentor/api-client';
import { Input } from '@/components/ui/input';

export const Register = () => {
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const register = useAuthStore((s) => s.register);
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register({
        email: values.email,
        username: values.username,
        password: values.password,
      });
      message.success('Account created');
      navigate('/', { replace: true });
    } catch (e) {
      const err = e as ApiError;
      if (err.status === 409) {
        setError('Email or username already exists');
      } else if (err.status === 422) {
        setError('Invalid registration data');
      } else if (err.status === 0) {
        setError('Unable to reach server');
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6">
      <Typography.Title level={2}>Register</Typography.Title>
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
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Enter a valid email' },
          ]}
        >
          <Input autoComplete="email" />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: 'Username is required' },
            { min: 3, message: 'Username must be at least 3 characters' },
          ]}
        >
          <Input autoComplete="username" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Password is required' },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
        >
          <Input type="password" autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          label="Confirm password"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input type="password" autoComplete="new-password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create account
          </Button>
        </Form.Item>
      </Form>
      <Typography.Paragraph>
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-neutral-200 underline underline-offset-4 hover:text-white"
        >
          Log in
        </Link>
      </Typography.Paragraph>
    </div>
  );
};
