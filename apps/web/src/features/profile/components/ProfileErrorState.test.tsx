import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileErrorState from './ProfileErrorState';

describe('ProfileErrorState', () => {
  it('renders error message with alert role', () => {
    render(<ProfileErrorState message="Network failed" onRetry={vi.fn()} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Network failed');
    expect(screen.getByText(/couldn't load profile/i)).toBeInTheDocument();
  });

  it('calls onRetry when retry clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ProfileErrorState message="err" onRetry={onRetry} />);
    await user.click(screen.getByRole('button', { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('shows retrying state', () => {
    render(<ProfileErrorState message="err" onRetry={vi.fn()} retrying />);
    const btn = screen.getByRole('button', { name: /retrying/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });
});
