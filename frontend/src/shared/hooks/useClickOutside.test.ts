import { fireEvent, renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
  it('calls handler when clicking outside of the element', () => {
    const handler = vi.fn();
    const outsideEl = document.createElement('div');
    document.body.appendChild(outsideEl);

    const insideEl = document.createElement('div');
    document.body.appendChild(insideEl);

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(insideEl);
      useClickOutside(ref, handler);
    });

    fireEvent.mouseDown(outsideEl);
    expect(handler).toHaveBeenCalledTimes(1);

    fireEvent.mouseDown(insideEl);
    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(outsideEl);
    document.body.removeChild(insideEl);
  });
});
