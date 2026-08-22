import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyProfileState from './EmptyProfileState';

describe('EmptyProfileState', () => {
  it('renders empty text and create button', () => {
    const onCreate = vi.fn();
    render(<EmptyProfileState onCreate={onCreate} />);
    expect(screen.getByText(/no profile yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create profile/i }),
    ).toBeInTheDocument();
  });

  it('calls onCreate when button clicked', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<EmptyProfileState onCreate={onCreate} />);
    await user.click(screen.getByRole('button', { name: /create profile/i }));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('disables button and shows creating state', () => {
    const onCreate = vi.fn();
    render(<EmptyProfileState onCreate={onCreate} creating />);
    const btn = screen.getByRole('button', { name: /creating/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('does not call onCreate when creating', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<EmptyProfileState onCreate={onCreate} creating />);
    await user.click(screen.getByRole('button', { name: /creating/i }));
    expect(onCreate).not.toHaveBeenCalled();
  });
});
