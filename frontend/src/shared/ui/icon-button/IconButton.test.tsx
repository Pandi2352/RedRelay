import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('renders with accessible name and type="button"', () => {
    render(<IconButton aria-label="Close dialog">X</IconButton>);
    const button = screen.getByRole('button', { name: 'Close dialog' });
    expect(button).toBeDefined();
    expect(button.getAttribute('type')).toBe('button');
  });

  it('sets disabled and aria-busy when loading', () => {
    render(
      <IconButton aria-label="Reload" loading>
        R
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: 'Reload' });
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
  });
});
