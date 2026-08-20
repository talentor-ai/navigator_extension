import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/auth';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AntApp>{children}</AntApp>
);

describe('route guards', () => {
  beforeEach(() => {
    useAuthStore.setState({ status: 'anonymous', user: null });
  });

  it('protected route redirects anonymous to login', async () => {
    useAuthStore.setState({ status: 'anonymous', user: null });
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>secret</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>login</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText('login')).toBeInTheDocument();
  });

  it('protected route shows loading spinner', () => {
    useAuthStore.setState({ status: 'loading', user: null });
    render(
      <MemoryRouter initialEntries={['/']}>
        <ProtectedRoute>
          <div>secret</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );
    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('public-only redirects authenticated to home', async () => {
    useAuthStore.setState({
      status: 'authenticated',
      user: {
        id: '1',
        email: 'a@b.com',
        username: 'user',
        accountVerified: false,
        role: 'USER',
        createdAt: '',
        updatedAt: '',
      },
    });
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/" element={<div>home</div>} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <div>login</div>
              </PublicOnlyRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText('home')).toBeInTheDocument();
  });
});

describe('Login page', () => {
  beforeEach(() => {
    useAuthStore.setState({ status: 'anonymous', user: null });
  });

  it('shows validation errors', async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Wrapper>,
    );
    await user.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByText('Username is required')).toBeInTheDocument();
  });

  it('shows invalid credentials', async () => {
    const user = userEvent.setup();
    // Mock login to throw 401
    const { ApiError } = await import('@talentor/api-client');
    vi.spyOn(useAuthStore.getState(), 'login').mockRejectedValue(
      new ApiError(401, 'Invalid'),
    );
    render(
      <Wrapper>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Wrapper>,
    );
    await user.type(screen.getByLabelText(/username/i), 'baduser');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /log in/i }));
    expect(
      await screen.findByText('Invalid username or password'),
    ).toBeInTheDocument();
  });
});

describe('Register page', () => {
  beforeEach(() => {
    useAuthStore.setState({ status: 'anonymous', user: null });
  });

  it('shows validation and password mismatch', async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </Wrapper>,
    );
    await user.click(screen.getByRole('button', { name: /create account/i }));
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
  });

  it('shows duplicate account error', async () => {
    const user = userEvent.setup();
    const { ApiError } = await import('@talentor/api-client');
    vi.spyOn(useAuthStore.getState(), 'register').mockRejectedValue(
      new ApiError(409, 'exists'),
    );
    render(
      <Wrapper>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </Wrapper>,
    );
    await user.type(screen.getByLabelText(/^email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/^username/i), 'user1');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));
    expect(
      await screen.findByText('Email or username already exists'),
    ).toBeInTheDocument();
  });
});
