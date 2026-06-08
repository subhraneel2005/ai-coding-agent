import { describe, it, expect } from 'bun:test';

// Simple utility function to test
function add(a: number, b: number): number {
  return a + b;
}

describe('add function', () => {
  it('should return the sum of two numbers', () => {
    const result = add(2, 3);
    expect(result).toBe(7);
  });
});
