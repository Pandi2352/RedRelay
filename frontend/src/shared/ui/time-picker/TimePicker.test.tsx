import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TimePicker } from './TimePicker';

describe('TimePicker', () => {
  it('renders with placeholder and opens popover on click', () => {
    render(<TimePicker placeholder="Set appointment time" />);
    const trigger = screen.getByRole('combobox');
    expect(screen.getByText('Set appointment time')).toBeDefined();

    fireEvent.click(trigger);
    expect(screen.getByText('Hrs')).toBeDefined();
    expect(screen.getByText('Min')).toBeDefined();
    expect(screen.getByText('Now')).toBeDefined();
  });

  it('formats initial time correctly in 12h mode', () => {
    render(<TimePicker value="14:30" format="12h" />);
    expect(screen.getByText('02:30 PM')).toBeDefined();
  });

  it('formats initial time correctly in 24h mode', () => {
    render(<TimePicker value="09:15" format="24h" />);
    expect(screen.getByText('09:15')).toBeDefined();
  });

  it('selects preset and triggers onChange', () => {
    const handleChange = vi.fn();
    render(<TimePicker onChange={handleChange} format="24h" />);

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const preset09 = screen.getByText('09:00');
    fireEvent.click(preset09);

    expect(handleChange).toHaveBeenCalledWith('09:00');
  });

  it('clears value when clear button is clicked', () => {
    const handleChange = vi.fn();
    render(<TimePicker value="10:00" onChange={handleChange} clearable />);

    const clearBtn = screen.getByLabelText('Clear time');
    fireEvent.click(clearBtn);

    expect(handleChange).toHaveBeenCalledWith('');
  });
});
