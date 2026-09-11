import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { components } from '@talentor/contracts';

import ProfilesLoadingView from './components/ProfilesLoadingView';
import ProfilesErrorView from './components/ProfilesErrorView';
import ProfilesEmptyView from './components/ProfilesEmptyView';
import ProfilesGrid from './components/ProfilesGrid';
import ProfilesHeader from './components/ProfilesHeader';
import ProfileCard from './components/ProfileCard';

type ProfileMetadata = components['schemas']['ProfileMetadata'];

function makeMeta(id: string, name: string): ProfileMetadata {
  return {
    id,
    name,
    currentVersion: 2,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  } as ProfileMetadata;
}

describe('ProfilesLoadingView', () => {
  it('renders loading profiles status', () => {
    render(<ProfilesLoadingView />);
    const status = screen.getByRole('status', { name: /loading profiles/i });
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText(/loading profiles/i)).toBeInTheDocument();
    // skeleton blocks
    const pulses = document.querySelectorAll('.animate-pulse');
    expect(pulses.length).toBeGreaterThan(5);
  });

  it('renders 6 skeleton cards', () => {
    const { container } = render(<ProfilesLoadingView />);
    const items = container.querySelectorAll('li');
    expect(items).toHaveLength(6);
  });
});

describe('ProfilesErrorView', () => {
  it('renders error message with alert', () => {
    render(<ProfilesErrorView message="Network failed" onRetry={vi.fn()} />);
    expect(screen.getByText('Network failed')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Network failed');
    expect(screen.getByText(/couldn't load profiles/i)).toBeInTheDocument();
  });

  it('calls onRetry when retry clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ProfilesErrorView message="err" onRetry={onRetry} />);
    await user.click(screen.getByRole('button', { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('shows retrying state', () => {
    render(<ProfilesErrorView message="err" onRetry={vi.fn()} retrying />);
    const btn = screen.getByRole('button', { name: /retrying/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });
});

describe('ProfilesEmptyView', () => {
  it('renders empty text and create button', () => {
    render(<ProfilesEmptyView onCreate={vi.fn()} />);
    expect(screen.getByText(/no profiles yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create profile/i }),
    ).toBeInTheDocument();
  });

  it('calls onCreate when clicked', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<ProfilesEmptyView onCreate={onCreate} />);
    await user.click(screen.getByRole('button', { name: /create profile/i }));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('disables button when creating', () => {
    render(<ProfilesEmptyView onCreate={vi.fn()} creating />);
    const btn = screen.getByRole('button', { name: /creating/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('does not call onCreate when creating', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<ProfilesEmptyView onCreate={onCreate} creating />);
    await user.click(screen.getByRole('button', { name: /creating/i }));
    expect(onCreate).not.toHaveBeenCalled();
  });
});

describe('ProfilesHeader', () => {
  it('shows title and zero profiles subtitle', () => {
    render(<ProfilesHeader count={0} onCreate={vi.fn()} />);
    expect(
      screen.getByRole('heading', { name: 'Profiles' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/create and manage/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /new profile/i }),
    ).toBeInTheDocument();
  });

  it('shows count for 1 and plural', () => {
    const { rerender } = render(
      <ProfilesHeader count={1} onCreate={vi.fn()} />,
    );
    expect(screen.getByText(/1 profile total/i)).toBeInTheDocument();
    rerender(<ProfilesHeader count={3} onCreate={vi.fn()} />);
    expect(screen.getByText(/3 profiles total/i)).toBeInTheDocument();
  });

  it('calls onCreate when new profile clicked', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<ProfilesHeader count={0} onCreate={onCreate} />);
    await user.click(screen.getByRole('button', { name: /new profile/i }));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });
});

describe('ProfilesGrid', () => {
  it('renders empty grid when no profiles', () => {
    render(
      <MemoryRouter>
        <ProfilesGrid profiles={[]} />
      </MemoryRouter>,
    );
    const list = screen.getByRole('list', { name: /profiles/i });
    expect(list).toBeInTheDocument();
    expect(list.children.length).toBe(0);
  });

  it('populated rendering shows accessible cards/links', () => {
    const metas = [
      makeMeta('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Alpha'),
      makeMeta('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Beta'),
    ];
    render(
      <MemoryRouter>
        <ProfilesGrid profiles={metas} />
      </MemoryRouter>,
    );
    const list = screen.getByRole('list', { name: /profiles/i });
    expect(list).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(
      screen.getByRole('link', { name: /view profile alpha/i }),
    ).toHaveAttribute('href', '/profile/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
    expect(
      screen.getByRole('link', { name: /view profile beta/i }),
    ).toHaveAttribute('href', '/profile/b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22');
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });
});

describe('ProfileCard', () => {
  it('renders version and dates', () => {
    const meta = makeMeta('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TestPro');
    render(
      <MemoryRouter>
        <ul>
          <ProfileCard profile={meta} />
        </ul>
      </MemoryRouter>,
    );
    expect(screen.getByText('TestPro')).toBeInTheDocument();
    expect(screen.getByText('v2')).toBeInTheDocument();
    expect(screen.getByLabelText(`View profile ${meta.name}`)).toHaveAttribute(
      'href',
      `/profile/${meta.id}`,
    );
  });
});
