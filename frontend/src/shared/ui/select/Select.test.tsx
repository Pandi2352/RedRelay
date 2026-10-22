import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Select } from './Select';

describe('Select', () => {
  it('renders options and selects values correctly', () => {
    render(
      <Select aria-label="Blood type" defaultValue="O_NEG">
        <option value="A_POS">A+</option>
        <option value="O_NEG">O-</option>
      </Select>,
    );
    const select = screen.getByRole('combobox', { name: 'Blood type' }) as HTMLSelectElement;
    expect(select.value).toBe('O_NEG');
  });

  it('marks aria-invalid when invalid prop is true', () => {
    render(
      <Select aria-label="Units" invalid>
        <option value="1">1 Unit</option>
      </Select>,
    );
    const select = screen.getByRole('combobox', { name: 'Units' });
    expect(select.getAttribute('aria-invalid')).toBe('true');
  });
});
