import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/components/ui/select', () => {
  let currentOnValueChange: ((v: string) => void) | undefined;
  return {
    Select: ({
      children,
      onValueChange,
      value,
      defaultValue,
      disabled,
    }: {
      children: React.ReactNode;
      onValueChange?: (v: string) => void;
      value?: string;
      defaultValue?: string;
      disabled?: boolean;
    }) => {
      currentOnValueChange = onValueChange;
      return (
        <div
          data-testid="select-root"
          data-value={value ?? ''}
          data-default-value={defaultValue ?? ''}
          data-disabled={disabled ? 'true' : undefined}
        >
          {children}
        </div>
      );
    },
    SelectTrigger: ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      children?: React.ReactNode;
    }) => <button {...props}>{children}</button>,
    SelectContent: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    SelectItem: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value: string;
    }) => (
      <div role="option" onClick={() => currentOnValueChange?.(value)}>
        {children}
      </div>
    ),
    SelectValue: () => <span />,
    SelectGroup: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    SelectLabel: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    SelectSeparator: () => <div />,
    SelectScrollUpButton: () => <div />,
    SelectScrollDownButton: () => <div />,
  };
});

import { EditableField } from './EditableField';

// jsdom helpers for Radix / antd leftovers
beforeAll(() => {
  const g = globalThis as unknown as Record<string, unknown>;
  if (!g.ResizeObserver) {
    g.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  const w = window as unknown as Record<string, unknown>;
  if (!w.ResizeObserver) {
    w.ResizeObserver = g.ResizeObserver;
  }
  const proto = HTMLElement.prototype as unknown as Record<string, unknown>;
  if (!proto.hasPointerCapture) {
    proto.hasPointerCapture = vi.fn(() => false);
  }
  if (!proto.setPointerCapture) {
    proto.setPointerCapture = vi.fn();
  }
  if (!proto.releasePointerCapture) {
    proto.releasePointerCapture = vi.fn();
  }
  if (!proto.scrollIntoView) {
    proto.scrollIntoView = vi.fn();
  }
  if (!window.getComputedStyle) {
    window.getComputedStyle =
      (() => ({})) as unknown as typeof window.getComputedStyle;
  }
});

describe('EditableField controlled inline editor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders controlled value and updates when prop changes', async () => {
    const { rerender } = render(<EditableField value="Hello" label="Name" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    rerender(<EditableField value="World" label="Name" />);
    expect(screen.getByText('World')).toBeInTheDocument();
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
  });

  it('select display maps value to label', () => {
    render(
      <EditableField
        value="b"
        label="Choice"
        editor="select"
        options={[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ]}
      />,
    );
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('opens on double-click', async () => {
    const user = userEvent.setup();
    render(<EditableField value="Hello" label="Name" />);
    const display = screen.getByLabelText('Edit Name');
    await user.dblClick(display);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('Hello');
  });

  it('opens on Enter key', async () => {
    const user = userEvent.setup();
    render(<EditableField value="Hello" label="Name" />);
    const display = screen.getByLabelText('Edit Name');
    display.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('opens on F2 key', async () => {
    const user = userEvent.setup();
    render(<EditableField value="Hello" label="Name" />);
    const display = screen.getByLabelText('Edit Name');
    display.focus();
    await user.keyboard('{F2}');
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('Escape cancels without submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<EditableField value="Hello" label="Name" onSubmit={onSubmit} />);
    const display = screen.getByLabelText('Edit Name');
    await user.dblClick(display);
    const input = screen.getByLabelText('Name') as HTMLInputElement;
    await user.clear(input);
    await user.type(input, 'Changed');
    await user.keyboard('{Escape}');
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('blur cancels without submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<EditableField value="Hello" label="Name" onSubmit={onSubmit} />);
    await user.dblClick(screen.getByLabelText('Edit Name'));
    const input = screen.getByLabelText('Name') as HTMLInputElement;
    await user.clear(input);
    await user.type(input, 'Changed');
    fireEvent.blur(input);
    await waitFor(() => expect(screen.getByText('Hello')).toBeInTheDocument());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('input Enter submits', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<EditableField value="Hello" label="Name" onSubmit={onSubmit} />);
    await user.dblClick(screen.getByLabelText('Edit Name'));
    const input = screen.getByLabelText('Name');
    await user.clear(input);
    await user.type(input, 'Updated');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('Updated'));
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('textarea Enter submits and Shift+Enter inserts newline without submit', async () => {
    const onSubmit = vi.fn();
    render(
      <EditableField
        value="line1"
        label="Bio"
        editor="textarea"
        onSubmit={onSubmit}
      />,
    );
    const user = userEvent.setup();
    await user.dblClick(screen.getByLabelText('Edit Bio'));
    const textarea = screen.getByLabelText('Bio') as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();

    textarea.focus();
    fireEvent.keyDown(textarea, {
      key: 'Enter',
      code: 'Enter',
      shiftKey: true,
    });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Bio')).toBeInTheDocument();

    await user.clear(textarea);
    await user.type(textarea, 'new value');
    fireEvent.keyDown(textarea, {
      key: 'Enter',
      code: 'Enter',
      shiftKey: false,
    });
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const lastCall = onSubmit.mock.calls[onSubmit.mock.calls.length - 1][0];
    expect(lastCall).toBe('new value');
  });

  it('select commits immediately', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <EditableField
        value="a"
        label="Choice"
        editor="select"
        options={[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ]}
        onSubmit={onSubmit}
      />,
    );
    await user.dblClick(screen.getByLabelText('Edit Choice'));
    const trigger = await screen.findByLabelText('Choice');
    expect(trigger).toBeInTheDocument();
    // Beta option rendered via mock SelectItem
    const option = await screen.findByText('Beta');
    await user.click(option);
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('b'));
    await waitFor(() => expect(screen.getByText('Alpha')).toBeInTheDocument());
  });

  it('pending locks opening/editing/submission and exposes aria-busy', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <EditableField value="Hello" label="Name" pending onSubmit={onSubmit} />,
    );
    const display = screen.getByLabelText('Edit Name');
    expect(display).toHaveAttribute('aria-busy', 'true');
    await user.dblClick(display);
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    display.focus();
    await user.keyboard('{Enter}');
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    fireEvent.keyDown(display, { key: 'F2', code: 'F2' });
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('keeps editor mounted disabled with aria-busy when pending becomes true', async () => {
    const { rerender } = render(
      <EditableField value="Hello" label="Name" pending={false} />,
    );
    const user = userEvent.setup();
    await user.dblClick(screen.getByLabelText('Edit Name'));
    const input = screen.getByLabelText('Name') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).not.toBeDisabled();
    await user.clear(input);
    await user.type(input, 'Draft');
    expect(input).toHaveValue('Draft');
    rerender(<EditableField value="Hello" label="Name" pending />);
    const pendingInput = screen.getByLabelText('Name') as HTMLInputElement;
    expect(pendingInput).toBeInTheDocument();
    expect(pendingInput).toBeDisabled();
    expect(pendingInput).toHaveAttribute('aria-busy', 'true');
    expect(pendingInput).toHaveValue('Draft');
    expect(screen.queryByLabelText('Edit Name')).not.toBeInTheDocument();
  });

  it('keeps textarea mounted disabled with aria-busy when pending becomes true', async () => {
    const { rerender } = render(
      <EditableField
        value="bio"
        label="Bio"
        editor="textarea"
        pending={false}
      />,
    );
    const user = userEvent.setup();
    await user.dblClick(screen.getByLabelText('Edit Bio'));
    const textarea = screen.getByLabelText('Bio') as HTMLTextAreaElement;
    await user.clear(textarea);
    await user.type(textarea, 'draft content');
    rerender(
      <EditableField value="bio" label="Bio" editor="textarea" pending />,
    );
    const pendingArea = screen.getByLabelText('Bio') as HTMLTextAreaElement;
    expect(pendingArea).toBeInTheDocument();
    expect(pendingArea).toBeDisabled();
    expect(pendingArea).toHaveAttribute('aria-busy', 'true');
    expect(pendingArea).toHaveValue('draft content');
  });

  it('keeps select mounted disabled with aria-busy when pending becomes true', async () => {
    const { rerender } = render(
      <EditableField
        value="a"
        label="Choice"
        editor="select"
        options={[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ]}
        pending={false}
      />,
    );
    const user = userEvent.setup();
    await user.dblClick(screen.getByLabelText('Edit Choice'));
    const trigger = screen.getByLabelText('Choice');
    expect(trigger).toBeInTheDocument();
    expect(trigger).not.toBeDisabled();
    rerender(
      <EditableField
        value="a"
        label="Choice"
        editor="select"
        options={[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ]}
        pending
      />,
    );
    const pendingTrigger = screen.getByLabelText('Choice');
    expect(pendingTrigger).toBeInTheDocument();
    expect(pendingTrigger).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByTestId('select-root')).toHaveAttribute(
      'data-disabled',
      'true',
    );
    // Radix disables via root; trigger disabled state is conveyed via data-disabled + aria-busy
    expect(screen.queryByLabelText('Edit Choice')).not.toBeInTheDocument();
  });

  it('empty value shows descriptive empty text with accessible target and opens empty input', async () => {
    const user = userEvent.setup();
    render(<EditableField value="" label="Name" />);
    const display = screen.getByLabelText('Edit Name');
    expect(display).toBeInTheDocument();
    expect(display).toHaveTextContent('No name provided');
    expect(screen.getByText('No name provided')).toBeInTheDocument();
    // aria-label remains Edit Name, not replaced
    expect(display).toHaveAttribute('aria-label', 'Edit Name');
    await user.dblClick(display);
    const input = screen.getByLabelText('Name') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
    // no placeholder prop used
    expect(input).not.toHaveAttribute('placeholder');
  });

  it('empty select value shows descriptive empty text', () => {
    render(
      <EditableField
        value=""
        label="Choice"
        editor="select"
        options={[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ]}
      />,
    );
    const display = screen.getByLabelText('Edit Choice');
    expect(display).toHaveTextContent('No choice provided');
  });

  it('custom empty text overrides the generated fallback', () => {
    render(
      <EditableField
        value=""
        label="Phone"
        emptyText="No phone number added"
      />,
    );
    expect(screen.getByText('No phone number added')).toBeInTheDocument();
  });

  it('select display and controlled value refresh on prop change', async () => {
    const { rerender } = render(
      <EditableField
        value="a"
        label="Choice"
        editor="select"
        options={[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ]}
      />,
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    rerender(
      <EditableField
        value="b"
        label="Choice"
        editor="select"
        options={[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ]}
      />,
    );
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();

    const user = userEvent.setup();
    await user.dblClick(screen.getByLabelText('Edit Choice'));
    const selectRoot = screen.getByTestId('select-root');
    expect(selectRoot).toHaveAttribute('data-value', 'b');
    expect(selectRoot).not.toHaveAttribute('data-default-value', 'b');

    rerender(
      <EditableField
        value="a"
        label="Choice"
        editor="select"
        options={[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ]}
      />,
    );
    expect(screen.getByTestId('select-root')).toHaveAttribute(
      'data-value',
      'a',
    );
  });

  it('error renders role alert only when exists', () => {
    const { rerender } = render(
      <EditableField value="Hello" label="Name" error="Boom" />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Boom');
    rerender(<EditableField value="Hello" label="Name" error={null} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    rerender(<EditableField value="Hello" label="Name" error="" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    rerender(<EditableField value="Hello" label="Name" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('catches rejected async onSubmit without unhandled rejection and recovers focus', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error('fail'));
    const unhandled: unknown[] = [];
    const handler = (e: PromiseRejectionEvent) => {
      unhandled.push(e.reason);
      e.preventDefault();
    };
    window.addEventListener('unhandledrejection', handler);
    render(<EditableField value="Hello" label="Name" onSubmit={onSubmit} />);
    const display = screen.getByLabelText('Edit Name');
    await user.dblClick(display);
    const input = screen.getByLabelText('Name');
    await user.clear(input);
    await user.type(input, 'Bad');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('Bad'));
    await new Promise((r) => setTimeout(r, 30));
    expect(unhandled).toHaveLength(0);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByLabelText('Edit Name')).toHaveFocus(),
    );
    window.removeEventListener('unhandledrejection', handler);
  });

  it('prevents double submission', async () => {
    let resolveSubmit!: () => void;
    const onSubmit: (value: string) => Promise<void> = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = () => resolve();
        }),
    );
    render(<EditableField value="Hello" label="Name" onSubmit={onSubmit} />);
    const user = userEvent.setup();
    await user.dblClick(screen.getByLabelText('Edit Name'));
    const input = screen.getByLabelText('Name');
    await user.clear(input);
    await user.type(input, 'Once');
    fireEvent.submit(input.closest('form')!);
    fireEvent.submit(input.closest('form')!);
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    resolveSubmit();
    await new Promise((r) => setTimeout(r, 10));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('disabled also blocks opening', async () => {
    const user = userEvent.setup();
    render(<EditableField value="Hello" label="Name" disabled />);
    const display = screen.getByLabelText('Edit Name');
    expect(display).toHaveAttribute('aria-disabled', 'true');
    await user.dblClick(display);
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    display.focus();
    await user.keyboard('{Enter}');
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
  });
});
