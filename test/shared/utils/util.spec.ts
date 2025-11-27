import { addNumbers } from '~/shared/utils/util-number.util';

describe('Utils', () => {
  it('should add two numbers correctly', () => {
    expect(addNumbers(2, 3)).toBe(5);
  });
});
