import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfileSkeleton from './ProfileSkeleton';

describe('ProfileSkeleton', () => {
  it('has accessible loading label', () => {
    render(<ProfileSkeleton />);
    const status = screen.getByRole('status', { name: /loading profile/i });
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute('aria-busy', 'true');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  it('renders skeleton cards', () => {
    const { container } = render(<ProfileSkeleton />);
    // should contain multiple pulsing blocks
    const pulses = container.querySelectorAll('.animate-pulse');
    expect(pulses.length).toBeGreaterThan(10);
  });
});
