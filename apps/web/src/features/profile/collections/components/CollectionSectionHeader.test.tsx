import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CollectionSectionHeader } from './CollectionSectionHeader';

describe('CollectionSectionHeader', () => {
  it('renders semantic title', () => {
    render(<CollectionSectionHeader title="Experience" onAdd={vi.fn()} />);
    expect(
      screen.getByRole('heading', { name: 'Experience' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Experience' }).tagName).toBe(
      'H2',
    );
  });

  it('shows Add button by default', async () => {
    const onAdd = vi.fn();
    render(<CollectionSectionHeader title="Skills" onAdd={onAdd} />);
    const btn = screen.getByRole('button', { name: /Add Skills/i });
    expect(btn).toBeInTheDocument();
    await userEvent.setup().click(btn);
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('hides Add when readOnly', () => {
    render(<CollectionSectionHeader title="Skills" onAdd={vi.fn()} readOnly />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('disables Add when pending', () => {
    render(<CollectionSectionHeader title="Skills" onAdd={vi.fn()} pending />);
    const btn = screen.getByRole('button', { name: /Add Skills/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('supports custom labels and heading level', () => {
    render(
      <CollectionSectionHeader
        title="Languages"
        onAdd={vi.fn()}
        addLabel="New language"
        addAriaLabel="Create language"
        headingLevel="h3"
      />,
    );
    expect(screen.getByRole('heading', { name: 'Languages' }).tagName).toBe(
      'H3',
    );
    expect(
      screen.getByRole('button', { name: 'Create language' }),
    ).toHaveTextContent('New language');
  });
});
