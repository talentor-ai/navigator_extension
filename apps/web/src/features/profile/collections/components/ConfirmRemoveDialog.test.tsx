import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmRemoveDialog } from './ConfirmRemoveDialog';

describe('ConfirmRemoveDialog', () => {
  it('renders nothing when closed', () => {
    render(
      <ConfirmRemoveDialog
        open={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title, description, and actions when open', () => {
    render(
      <ConfirmRemoveDialog
        open
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        title="Delete experience?"
        description="This will remove the item."
      />,
    );
    expect(
      screen.getByRole('dialog', { name: 'Delete experience?' }),
    ).toBeInTheDocument();
    expect(screen.getByText('This will remove the item.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('calls onConfirm and onCancel without mutation logic', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmRemoveDialog open onConfirm={onConfirm} onCancel={onCancel} />,
    );
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Remove' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('disables actions and shows pending state', () => {
    render(
      <ConfirmRemoveDialog
        open
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        pending
      />,
    );
    expect(screen.getByRole('button', { name: 'Removing...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('supports custom labels', async () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmRemoveDialog
        open
        onConfirm={onConfirm}
        onCancel={vi.fn()}
        confirmLabel="Delete forever"
        cancelLabel="Keep"
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Delete forever' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
  });

  it('is controlled presentational (no auto-close)', () => {
    const onConfirm = vi.fn();
    const { rerender } = render(
      <ConfirmRemoveDialog open onConfirm={onConfirm} onCancel={vi.fn()} />,
    );
    // still open after confirm click unless parent closes
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    rerender(
      <ConfirmRemoveDialog
        open={false}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('blocks backdrop cancel when pending, keeps actions disabled and exposes busy semantics', async () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    const { rerender } = render(
      <ConfirmRemoveDialog
        open
        pending
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button', { name: 'Removing...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Removing...' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();

    // backdrop click must not call onCancel when pending
    await userEvent.setup().click(dialog);
    expect(onCancel).not.toHaveBeenCalled();

    // disabled actions must not trigger callbacks when pending
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).not.toHaveBeenCalled();
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Removing...' }));
    expect(onConfirm).not.toHaveBeenCalled();

    // content click also must not bubble to backdrop
    await userEvent
      .setup()
      .click(screen.getByText('This action cannot be undone.'));
    expect(onCancel).not.toHaveBeenCalled();

    // non-pending restores backdrop cancel and clears busy semantics
    rerender(
      <ConfirmRemoveDialog
        open
        pending={false}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-busy');
    expect(screen.getByRole('button', { name: 'Remove' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).not.toBeDisabled();
    await userEvent.setup().click(screen.getByRole('dialog'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
