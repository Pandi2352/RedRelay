import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders native input and handles placeholder and value', () => {
    render(<Input placeholder="Hospital name" defaultValue="Metro General" />);
    const input = screen.getByPlaceholderText('Hospital name') as HTMLInputElement;
    expect(input.value).toBe('Metro General');
  });

  it('sets aria-invalid when invalid prop is true', () => {
    render(<Input placeholder="Email" invalid />);
    const input = screen.getByPlaceholderText('Email');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
});
