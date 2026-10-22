import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';
import type { SelectOption } from './select.types';

const mockOptions: SelectOption[] = [
  { value: 'O_NEG', label: 'O Negative', description: 'Universal donor' },
  { value: 'O_POS', label: 'O Positive', description: 'Common blood type' },
  { value: 'A_NEG', label: 'A Negative' },
  { value: 'B_POS', label: 'B Positive' },
];

describe('Select', () => {
  it('renders with placeholder and selects an option in single-select mode', () => {
    const handleChange = vi.fn();
    render(
      <Select
        placeholder="Choose blood type"
        options={mockOptions}
        value=""
        onChange={handleChange}
      />,
    );

    const trigger = screen.getByRole('combobox');
    expect(screen.getByText('Choose blood type')).toBeDefined();

    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeDefined();

    const option = screen.getByText('O Negative');
    fireEvent.click(option);

    expect(handleChange).toHaveBeenCalledWith('O_NEG');
  });

  it('filters options with real-time search', () => {
    render(<Select options={mockOptions} value="" />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Universal' } });

    expect(screen.getByText('O Negative')).toBeDefined();
    expect(screen.queryByText('B Positive')).toBeNull();
  });

  it('supports multi-select with chips and multiple values', () => {
    const handleChange = vi.fn();
    render(
      <Select
        multiple
        options={mockOptions}
        value={['O_NEG', 'A_NEG']}
        onChange={handleChange}
      />,
    );

    expect(screen.getByText('O Negative')).toBeDefined();
    expect(screen.getByText('A Negative')).toBeDefined();

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const bPosOption = screen.getByText('B Positive');
    fireEvent.click(bPosOption);

    expect(handleChange).toHaveBeenCalledWith(['O_NEG', 'A_NEG', 'B_POS']);
  });
});
