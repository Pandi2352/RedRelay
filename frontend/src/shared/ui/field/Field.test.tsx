import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Field } from './Field';

describe('Field', () => {
  it('renders label and hint text', () => {
    render(
      <Field label="Phone number" htmlFor="phone-input" hint="Include country code">
        <input id="phone-input" />
      </Field>,
    );
    expect(screen.getByText('Phone number')).toBeDefined();
    expect(screen.getByText('Include country code')).toBeDefined();
  });

  it('renders error message in alert role when error is provided', () => {
    render(
      <Field
        label="Units needed"
        htmlFor="units"
        hint="Default helper"
        error="Units must be between 1 and 20"
      >
        <input id="units" />
      </Field>,
    );
    expect(screen.getByRole('alert').textContent).toBe('Units must be between 1 and 20');
    // Hint is replaced by error when error is present
    expect(screen.queryByText('Default helper')).toBeNull();
  });
});
