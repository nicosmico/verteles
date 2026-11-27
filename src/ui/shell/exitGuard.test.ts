import { describe, expect, it } from 'vitest';
import { createExitGuard } from './exitGuard';

describe('exit guard', () => {
  it('asks for confirmation on the first Back', () => {
    const guard = createExitGuard({ windowMs: 2000 });

    expect(guard.pressBack(10_000)).toBe('confirm');
  });

  it('exits on a second Back within the window', () => {
    const guard = createExitGuard({ windowMs: 2000 });
    guard.pressBack(10_000);

    expect(guard.pressBack(11_500)).toBe('exit');
  });

  it('asks again when the second Back comes after the window', () => {
    const guard = createExitGuard({ windowMs: 2000 });
    guard.pressBack(10_000);

    expect(guard.pressBack(12_001)).toBe('confirm');
    expect(guard.pressBack(13_000)).toBe('exit');
  });
});
