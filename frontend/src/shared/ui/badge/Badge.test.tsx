import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders content with soft neutral defaults', () => {
    render(<Badge>Emergency</Badge>);
    const badge = screen.getByText('Emergency');
    expect(badge).toBeDefined();
    expect(badge.className).toContain('rounded-md');
  });

  it('applies tone and solid variant classes', () => {
    render(
      <Badge tone="danger" variant="solid">
        Critical
      </Badge>,
    );
    const badge = screen.getByText('Critical');
    expect(badge.className).toContain('bg-danger');
    expect(badge.className).toContain('text-danger-fg');
  });
});
