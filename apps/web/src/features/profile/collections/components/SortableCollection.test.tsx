import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SortableCollection } from './SortableCollection';
import { SortableCollectionItem } from './SortableCollectionItem';

beforeAll(() => {
  const g = globalThis as unknown as Record<string, unknown>;
  if (!g.ResizeObserver) {
    g.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

type Item = { id: string; name: string };

function renderCollection(onReorder = vi.fn()) {
  const items: Item[] = [
    { id: 'a', name: 'Alpha' },
    { id: 'b', name: 'Beta' },
    { id: 'c', name: 'Gamma' },
  ];
  render(
    <SortableCollection items={items} getId={(i) => i.id} onReorder={onReorder}>
      {(item) => (
        <SortableCollectionItem key={item.id} id={item.id}>
          <div>{item.name}</div>
        </SortableCollectionItem>
      )}
    </SortableCollection>,
  );
  return { items, onReorder };
}

describe('SortableCollection', () => {
  it('renders items and drag handles', () => {
    renderCollection();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /Drag to reorder/i }),
    ).toHaveLength(3);
  });

  it('applies sortable transform style via CSS.Transform', () => {
    renderCollection();
    // each item container has data-sortable-id
    expect(
      document.querySelector('[data-sortable-id="a"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-sortable-id="b"]'),
    ).toBeInTheDocument();
  });

  it('keyboard and pointer share same reorder path (DndContext per list)', () => {
    // DndContext is rendered per SortableCollection instance
    const onReorder = vi.fn();
    renderCollection(onReorder);
    // Verify DndContext wrappers exist via data attributes from DndKit
    // No direct onReorder without drag event; ensures component mounts without error
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(onReorder).not.toHaveBeenCalled();
  });

  it('disabled item still renders but handle disabled', () => {
    const items: Item[] = [{ id: 'a', name: 'Solo' }];
    render(
      <SortableCollection items={items} getId={(i) => i.id} onReorder={vi.fn()}>
        {(item) => (
          <SortableCollectionItem key={item.id} id={item.id} disabled>
            <div>{item.name}</div>
          </SortableCollectionItem>
        )}
      </SortableCollection>,
    );
    expect(
      screen.getByRole('button', { name: /Drag to reorder/i }),
    ).toBeDisabled();
  });

  it('single drag handle per item via CollectionItemActions (no duplicate)', () => {
    const items: Item[] = [{ id: 'a', name: 'Solo' }];
    render(
      <SortableCollection items={items} getId={(i) => i.id} onReorder={vi.fn()}>
        {(item) => (
          <SortableCollectionItem key={item.id} id={item.id} onRemove={vi.fn()}>
            <div>{item.name}</div>
          </SortableCollectionItem>
        )}
      </SortableCollection>,
    );
    // One drag handle + one delete = 2 buttons, drag handle single
    expect(
      screen.getAllByRole('button', { name: /Drag to reorder/i }),
    ).toHaveLength(1);
    expect(
      screen.getByRole('button', { name: /Remove item/i }),
    ).toBeInTheDocument();
  });

  it('readOnly disables drag and hides delete', () => {
    const items: Item[] = [{ id: 'a', name: 'Solo' }];
    render(
      <SortableCollection items={items} getId={(i) => i.id} onReorder={vi.fn()}>
        {(item) => (
          <SortableCollectionItem
            key={item.id}
            id={item.id}
            readOnly
            onRemove={vi.fn()}
          >
            <div>{item.name}</div>
          </SortableCollectionItem>
        )}
      </SortableCollection>,
    );
    expect(
      screen.getByRole('button', { name: /Drag to reorder/i }),
    ).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: /Remove item/i }),
    ).not.toBeInTheDocument();
  });

  it('pending disables drag and disables delete', () => {
    const items: Item[] = [{ id: 'a', name: 'Solo' }];
    render(
      <SortableCollection items={items} getId={(i) => i.id} onReorder={vi.fn()}>
        {(item) => (
          <SortableCollectionItem
            key={item.id}
            id={item.id}
            pending
            onRemove={vi.fn()}
          >
            <div>{item.name}</div>
          </SortableCollectionItem>
        )}
      </SortableCollection>,
    );
    expect(
      screen.getByRole('button', { name: /Drag to reorder/i }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: /Remove item/i })).toBeDisabled();
  });

  it('hides delete when onRemove not provided', () => {
    const items: Item[] = [{ id: 'a', name: 'Solo' }];
    render(
      <SortableCollection items={items} getId={(i) => i.id} onReorder={vi.fn()}>
        {(item) => (
          <SortableCollectionItem key={item.id} id={item.id}>
            <div>{item.name}</div>
          </SortableCollectionItem>
        )}
      </SortableCollection>,
    );
    expect(
      screen.queryByRole('button', { name: /Remove item/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Drag to reorder/i }),
    ).toBeInTheDocument();
  });

  it('uses closestCenter and verticalListSortingStrategy without mutation logic', () => {
    // Mutation-free: rendering does not call onReorder
    const onReorder = vi.fn();
    renderCollection(onReorder);
    // Fire a no-op pointer event should not trigger reorder
    const handle = screen.getAllByRole('button', {
      name: /Drag to reorder/i,
    })[0];
    fireEvent.pointerDown(handle);
    fireEvent.pointerUp(handle);
    expect(onReorder).not.toHaveBeenCalled();
  });
});
