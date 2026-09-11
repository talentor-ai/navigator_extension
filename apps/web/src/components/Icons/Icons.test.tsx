import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Icons } from './index';
import { ICON_COMPONENTS } from './constants';

describe('Icons', () => {
  const types = Object.keys(ICON_COMPONENTS) as Array<
    keyof typeof ICON_COMPONENTS
  >;

  it('exports all required icon types', () => {
    expect(types.sort()).toEqual(
      [
        'add',
        'check',
        'chevronDown',
        'chevronUp',
        'close',
        'delete',
        'drag',
        'home',
        'logout',
        'menu',
        'profile',
      ].sort(),
    );
  });

  it.each(types)('renders %s icon via test attribute', (type) => {
    render(<Icons type={type} data-testid={`icon-${type}`} />);
    const el = screen.getByTestId(`icon-${type}`);
    expect(el).toBeInTheDocument();
    expect(el.tagName.toLowerCase()).toBe('svg');
  });

  it.each(types)('renders %s with accessible label via aria-label', (type) => {
    const label = `${type} icon`;
    render(<Icons type={type} aria-label={label} />);
    expect(screen.getByLabelText(label)).toBeInTheDocument();
  });

  it('passes className through', () => {
    render(
      <Icons
        type="home"
        data-testid="class-test"
        className="test-class extra"
      />,
    );
    const el = screen.getByTestId('class-test');
    expect(el).toHaveClass('test-class');
    expect(el).toHaveClass('extra');
  });

  it('passes style through', () => {
    render(
      <Icons
        type="profile"
        data-testid="style-test"
        style={{ color: 'rgb(255, 0, 0)', marginLeft: '10px' }}
      />,
    );
    const el = screen.getByTestId('style-test');
    expect(el).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(el.style.marginLeft).toBe('10px');
  });

  it('passes className and style together', () => {
    render(
      <Icons
        type="logout"
        data-testid="combined-test"
        className="combined-class"
        style={{ color: 'blue' }}
      />,
    );
    const el = screen.getByTestId('combined-test');
    expect(el).toHaveClass('combined-class');
    expect(el.style.color).toBe('blue');
  });

  it('passes extra SVG props like aria-hidden, id, data attributes', () => {
    render(
      <Icons
        type="check"
        data-testid="extra-props"
        aria-hidden="true"
        id="custom-id"
        data-custom="custom-value"
      />,
    );
    const el = screen.getByTestId('extra-props');
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).toHaveAttribute('id', 'custom-id');
    expect(el).toHaveAttribute('data-custom', 'custom-value');
  });

  it('passes size, color, title props (react-icons)', () => {
    render(
      <Icons
        type="add"
        data-testid="react-icons-props"
        size={24}
        color="red"
        title="Add title"
      />,
    );
    const el = screen.getByTestId('react-icons-props');
    expect(el).toBeInTheDocument();
    // react-icons applies size via width/height attributes
    expect(el).toHaveAttribute('width', '24');
    expect(el).toHaveAttribute('height', '24');
  });

  it('preserves aria-hidden false case', () => {
    render(<Icons type="delete" data-testid="aria-test" aria-hidden="false" />);
    expect(screen.getByTestId('aria-test')).toHaveAttribute(
      'aria-hidden',
      'false',
    );
  });

  it('renders drag icon with aria-hidden', () => {
    render(<Icons type="drag" aria-hidden="true" data-testid="drag-icon" />);
    const el = screen.getByTestId('drag-icon');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });
});
