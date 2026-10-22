import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  it('renders with placeholder and opens calendar popover on click', () => {
    render(<DatePicker placeholder="Select required date" />);
    const trigger = screen.getByRole('combobox');
    expect(screen.getByText('Select required date')).toBeDefined();

    fireEvent.click(trigger);
    expect(screen.getByText('Today')).toBeDefined();
    expect(screen.getByText('Tomorrow')).toBeDefined();
  });

  it('selects date when day is clicked', () => {
    const handleChange = vi.fn();
    render(<DatePicker value="2026-10-15" onChange={handleChange} />);

    expect(screen.getByText(/15 Oct 2026/)).toBeDefined();

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const day20 = screen.getByText('20');
    fireEvent.click(day20);

    expect(handleChange).toHaveBeenCalledWith('2026-10-20');
  });

  it('clears date when clear icon is clicked', () => {
    const handleChange = vi.fn();
    render(<DatePicker value="2026-10-15" onChange={handleChange} clearable />);

    const clearBtn = screen.getByLabelText('Clear date');
    fireEvent.click(clearBtn);

    expect(handleChange).toHaveBeenCalledWith('');
  });
});
