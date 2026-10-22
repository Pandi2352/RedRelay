import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders native textarea with placeholder and content', () => {
    render(<Textarea placeholder="Delivery instructions" defaultValue="Floor 3, ICU" />);
    const textarea = screen.getByPlaceholderText('Delivery instructions') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Floor 3, ICU');
  });

  it('marks aria-invalid when invalid is true', () => {
    render(<Textarea placeholder="Notes" invalid />);
    const textarea = screen.getByPlaceholderText('Notes');
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
  });
});
