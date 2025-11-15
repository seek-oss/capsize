import { describe, expect, it } from 'vitest';
import { getCapHeight } from './';

describe('getCapHeight', () => {
  it('should return cap height based on provided font size and metrics', () => {
    const options = {
      fontSize: 150,
      fontMetrics: {
        capHeight: 1356,
        ascent: 1825,
        descent: -443,
        lineGap: 87,
        unitsPerEm: 2048,
      },
    };
    expect(getCapHeight(options)).toBe(99.3164);
  });
});
