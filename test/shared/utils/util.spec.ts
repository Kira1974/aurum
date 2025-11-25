import { addNumbers, capitalize } from '~/shared/utils/util-number.util';

describe('Utils', () => {
  it('should add two numbers correctly', () => {
    expect(addNumbers(2, 3)).toBe(5);
  });

  it('should capitalize the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should return empty string if input is empty', () => {
    expect(capitalize('')).toBe('');
  });
});
