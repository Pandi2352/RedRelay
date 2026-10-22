import { cn } from './cn';

describe('cn', () => {
  it('drops falsy values and joins the rest', () => {
    expect(cn('a', false, undefined, 'b')).toBe('a b');
  });

  it('lets the later spacing class win', () => {
    expect(cn('px-3', 'px-4')).toBe('px-4');
  });
});
