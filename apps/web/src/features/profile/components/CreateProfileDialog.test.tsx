import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateProfileDialog from './CreateProfileDialog';

const baseProps = {
  open: true,
  pending: false,
  error: null as string | null,
  onCancel: vi.fn(),
  onSubmit: vi.fn(),
};

describe('CreateProfileDialog', () => {
  it('renders fields when open', async () => {
    render(<CreateProfileDialog {...baseProps} />);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/profile name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/locale/i)).toBeInTheDocument();
  });

  it('does not render dialog when closed', () => {
    render(<CreateProfileDialog {...baseProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows error prop', async () => {
    render(<CreateProfileDialog {...baseProps} error="Server error" />);
    expect(await screen.findByText('Server error')).toBeInTheDocument();
  });

  it('validates required fields and does not submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CreateProfileDialog {...baseProps} onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: /^create$/i }));
    expect(
      await screen.findByText('Profile name is required'),
    ).toBeInTheDocument();
    expect(screen.getByText('Full name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Locale is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CreateProfileDialog {...baseProps} onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/profile name/i), 'My profile');
    await user.type(screen.getByLabelText(/^full name/i), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/^email/i), 'invalid-email');
    await user.type(screen.getByLabelText(/locale/i), 'en-US');
    await user.click(screen.getByRole('button', { name: /^create$/i }));
    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('validates profile name max 120', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CreateProfileDialog {...baseProps} onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/profile name/i), 'a'.repeat(121));
    await user.type(screen.getByLabelText(/^full name/i), 'Ada');
    await user.type(screen.getByLabelText(/^email/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/locale/i), 'en-US');
    await user.click(screen.getByRole('button', { name: /^create$/i }));
    expect(
      await screen.findByText('Profile name must be at most 120 characters'),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits with trimmed values when valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<CreateProfileDialog {...baseProps} onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/profile name/i), '  Backend  ');
    await user.type(screen.getByLabelText(/^full name/i), ' Ada Lovelace ');
    await user.type(screen.getByLabelText(/^email/i), ' ada@example.com ');
    await user.type(screen.getByLabelText(/locale/i), ' en-US ');
    await user.click(screen.getByRole('button', { name: /^create$/i }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Backend',
        fullName: 'Ada Lovelace',
        email: 'ada@example.com',
        locale: 'en-US',
      }),
    );
  });

  it('keeps values on failed submit (error prop) and not reset', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { rerender } = render(
      <CreateProfileDialog {...baseProps} onSubmit={onSubmit} />,
    );
    await user.type(screen.getByLabelText(/profile name/i), 'My profile');
    await user.type(screen.getByLabelText(/^full name/i), 'Ada');
    await user.type(screen.getByLabelText(/^email/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/locale/i), 'en-US');
    await user.click(screen.getByRole('button', { name: /^create$/i }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    // simulate parent setting error but keeping open
    rerender(
      <CreateProfileDialog
        {...baseProps}
        error="Duplicate name"
        onSubmit={onSubmit}
      />,
    );
    expect(screen.getByLabelText(/profile name/i)).toHaveValue('My profile');
    expect(screen.getByText('Duplicate name')).toBeInTheDocument();
  });

  it('disables inputs and buttons when pending', async () => {
    render(<CreateProfileDialog {...baseProps} pending />);
    expect(screen.getByLabelText(/profile name/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });

  it('resets only after successful close not failed submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { rerender } = render(
      <CreateProfileDialog {...baseProps} onSubmit={onSubmit} open />,
    );
    await user.type(screen.getByLabelText(/profile name/i), 'Test');
    await user.type(screen.getByLabelText(/^full name/i), 'Ada');
    await user.type(screen.getByLabelText(/^email/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/locale/i), 'en-US');
    // close via parent (simulate successful close)
    rerender(
      <CreateProfileDialog {...baseProps} onSubmit={onSubmit} open={false} />,
    );
    // reopen
    rerender(<CreateProfileDialog {...baseProps} onSubmit={onSubmit} open />);
    expect(screen.getByLabelText(/profile name/i)).toHaveValue('');
  });

  it('calls onCancel when cancel clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<CreateProfileDialog {...baseProps} onCancel={onCancel} />);
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
