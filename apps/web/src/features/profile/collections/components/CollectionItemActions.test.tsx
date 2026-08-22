import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CollectionItemActions } from './CollectionItemActions';

describe('CollectionItemActions', () => {
  it('renders drag handle with accessible label and delete button', () => {
    const onRemove = vi.fn();
    render(<CollectionItemActions onRemove={onRemove} />);
    expect(
      screen.getByRole('button', { name: /Drag to reorder/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Remove item/i }),
    ).toBeInTheDocument();
  });

  it('calls onRemove when delete clicked', async () => {
    const onRemove = vi.fn();
    render(<CollectionItemActions onRemove={onRemove} />);
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: /Remove item/i }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('disables drag and delete when disabled', () => {
    render(<CollectionItemActions onRemove={vi.fn()} disabled />);
    expect(
      screen.getByRole('button', { name: /Drag to reorder/i }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: /Remove item/i })).toBeDisabled();
  });

  it('hides delete when readOnly but keeps drag disabled', () => {
    render(<CollectionItemActions onRemove={vi.fn()} readOnly />);
    expect(
      screen.queryByRole('button', { name: /Remove item/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Drag to reorder/i }),
    ).toBeDisabled();
  });

  it('wires drag attributes/listeners to handle', () => {
    const dragAttributes = {
      'aria-describedby': 'desc-id',
    } as unknown as Record<string, unknown>;
    const dragListeners = { onPointerDown: vi.fn() } as unknown as Record<
      string,
      unknown
    >;
    render(
      <CollectionItemActions
        onRemove={vi.fn()}
        dragAttributes={dragAttributes}
        dragListeners={dragListeners}
      />,
    );
    const handle = screen.getByRole('button', { name: /Drag to reorder/i });
    expect(handle).toHaveAttribute('aria-describedby', 'desc-id');
  });

  it('supports custom labels', () => {
    render(
      <CollectionItemActions
        onRemove={vi.fn()}
        removeLabel="Delete skill"
        dragLabel="Reorder skill"
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Reorder skill' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Delete skill' }),
    ).toBeInTheDocument();
  });

  it('renders only drag handle when onRemove not provided', () => {
    render(<CollectionItemActions />);
    expect(
      screen.getByRole('button', { name: /Drag to reorder/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Remove item/i }),
    ).not.toBeInTheDocument();
  });

  it('hides delete when onRemove not provided even not readOnly', () => {
    render(<CollectionItemActions readOnly={false} />);
    expect(
      screen.queryByRole('button', { name: /Remove/i }),
    ).not.toBeInTheDocument();
  });

  it('pending disables drag and delete', () => {
    render(<CollectionItemActions onRemove={vi.fn()} pending />);
    expect(
      screen.getByRole('button', { name: /Drag to reorder/i }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: /Remove item/i })).toBeDisabled();
  });

  it('readOnly hides delete and disables drag, pending also disables drag', () => {
    render(<CollectionItemActions pending readOnly onRemove={vi.fn()} />);
    expect(
      screen.queryByRole('button', { name: /Remove item/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Drag to reorder/i }),
    ).toBeDisabled();
  });
});
