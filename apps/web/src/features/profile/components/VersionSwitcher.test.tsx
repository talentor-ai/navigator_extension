import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VersionSwitcher from './VersionSwitcher';
import type { components } from '@talentor/contracts';

type Meta = components['schemas']['ProfileVersionMetadata'];

const makeVersion = (
  overrides: Partial<Meta> & { versionNumber: number },
): Meta => ({
  id: overrides.id ?? `id-${overrides.versionNumber}`,
  versionNumber: overrides.versionNumber,
  schemaVersion: 1,
  sourceType: overrides.sourceType ?? 'MANUAL',
  createdAt: overrides.createdAt ?? '2025-03-10T14:30:00.000Z',
  isCurrent: overrides.isCurrent ?? false,
});

const versions: Meta[] = [
  makeVersion({ versionNumber: 3, isCurrent: true, sourceType: 'MANUAL' }),
  makeVersion({ versionNumber: 2, sourceType: 'RESUME_PARSE' }),
  makeVersion({ versionNumber: 1, sourceType: 'IMPORT' }),
];

describe('VersionSwitcher', () => {
  it('shows version number, date, source and current marker', () => {
    render(
      <VersionSwitcher
        versions={versions}
        currentVersion={3}
        previewVersion={null}
        pendingVersion={null}
        error={null}
        onPreview={vi.fn()}
        onActivate={vi.fn()}
        onExitPreview={vi.fn()}
      />,
    );
    expect(screen.getByText('Version 3')).toBeInTheDocument();
    expect(screen.getByText('Version 2')).toBeInTheDocument();
    expect(screen.getByText(/MANUAL/)).toBeInTheDocument();
    expect(screen.getByText(/RESUME_PARSE/)).toBeInTheDocument();
    expect(screen.getAllByText('Current').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/2025-03-10/).length).toBeGreaterThan(0);
  });

  it('calls onPreview when preview clicked', async () => {
    const user = userEvent.setup();
    const onPreview = vi.fn();
    render(
      <VersionSwitcher
        versions={versions}
        currentVersion={3}
        previewVersion={null}
        pendingVersion={null}
        error={null}
        onPreview={onPreview}
        onActivate={vi.fn()}
        onExitPreview={vi.fn()}
      />,
    );
    await user.click(screen.getAllByRole('button', { name: /preview/i })[1]);
    expect(onPreview).toHaveBeenCalledWith(2);
  });

  it('shows preview banner and exit', async () => {
    const user = userEvent.setup();
    const onExitPreview = vi.fn();
    render(
      <VersionSwitcher
        versions={versions}
        currentVersion={3}
        previewVersion={2}
        pendingVersion={null}
        error={null}
        onPreview={vi.fn()}
        onActivate={vi.fn()}
        onExitPreview={onExitPreview}
      />,
    );
    expect(screen.getByText(/previewing version 2/i)).toBeInTheDocument();
    expect(screen.getByText(/read-only/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /exit preview/i }));
    expect(onExitPreview).toHaveBeenCalledTimes(1);
  });

  it('requires confirmation before activation', async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    render(
      <VersionSwitcher
        versions={versions}
        currentVersion={3}
        previewVersion={null}
        pendingVersion={null}
        error={null}
        onPreview={vi.fn()}
        onActivate={onActivate}
        onExitPreview={vi.fn()}
      />,
    );
    // click activate on version 2 (not current)
    const activateButtons = screen.getAllByRole('button', {
      name: /activate version 2/i,
    });
    expect(activateButtons.length).toBeGreaterThan(0);
    await user.click(activateButtons[0]);
    // should now show confirm, not yet called
    expect(onActivate).not.toHaveBeenCalled();
    expect(screen.getByText(/confirm activation\?/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^confirm$/i }));
    expect(onActivate).toHaveBeenCalledWith(2);
  });

  it('cancel confirmation does not activate', async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    render(
      <VersionSwitcher
        versions={versions}
        currentVersion={3}
        previewVersion={null}
        pendingVersion={null}
        error={null}
        onPreview={vi.fn()}
        onActivate={onActivate}
        onExitPreview={vi.fn()}
      />,
    );
    await user.click(
      screen.getByRole('button', { name: /activate version 2/i }),
    );
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onActivate).not.toHaveBeenCalled();
    expect(screen.queryByText(/confirm activation\?/i)).not.toBeInTheDocument();
  });

  it('shows error and pending state', () => {
    render(
      <VersionSwitcher
        versions={versions}
        currentVersion={3}
        previewVersion={null}
        pendingVersion={2}
        error="Activate failed"
        onPreview={vi.fn()}
        onActivate={vi.fn()}
        onExitPreview={vi.fn()}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Activate failed');
    expect(
      screen.getByRole('button', { name: /activating/i }),
    ).toBeInTheDocument();
  });

  it('disables activate for current version', () => {
    render(
      <VersionSwitcher
        versions={versions}
        currentVersion={3}
        previewVersion={null}
        pendingVersion={null}
        error={null}
        onPreview={vi.fn()}
        onActivate={vi.fn()}
        onExitPreview={vi.fn()}
      />,
    );
    expect(
      screen.getByRole('button', { name: /activate version 3/i }),
    ).toBeDisabled();
  });
});
