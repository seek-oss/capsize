import { describe, expect, it } from 'vitest';
import { precomputeValues } from './';

describe('precomputeValues', () => {
  it('should handle providing fontSize and leading', () => {
    const options = {
      fontSize: 150,
      leading: 180,
      fontMetrics: {
        capHeight: 1356,
        ascent: 1825,
        descent: -443,
        lineGap: 87,
        unitsPerEm: 2048,
      },
    };
    expect(precomputeValues(options)).toMatchInlineSnapshot(`
      {
        "baselineTrim": "-0.2626em",
        "capHeightTrim": "-0.2753em",
        "fontSize": "150px",
        "lineHeight": "180px",
      }
    `);
  });

  it('should handle providing fontSize and lineGap', () => {
    const options = {
      fontSize: 150,
      lineGap: 30,
      fontMetrics: {
        capHeight: 1356,
        ascent: 1825,
        descent: -443,
        lineGap: 87,
        unitsPerEm: 2048,
      },
    };
    expect(precomputeValues(options)).toMatchInlineSnapshot(`
      {
        "baselineTrim": "-0.0937em",
        "capHeightTrim": "-0.1063em",
        "fontSize": "150px",
        "lineHeight": "129.3164px",
      }
    `);
  });

  it('should handle providing fontSize only', () => {
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
    expect(precomputeValues(options)).toMatchInlineSnapshot(`
      {
        "baselineTrim": "-0.2375em",
        "capHeightTrim": "-0.2502em",
        "fontSize": "150px",
        "lineHeight": "normal",
      }
    `);
  });

  it('should handle providing capHeight and leading', () => {
    const options = {
      capHeight: 120,
      leading: 180,
      fontMetrics: {
        capHeight: 1356,
        ascent: 1825,
        descent: -443,
        lineGap: 87,
        unitsPerEm: 2048,
      },
    };
    expect(precomputeValues(options)).toMatchInlineSnapshot(`
      {
        "baselineTrim": "-0.1592em",
        "capHeightTrim": "-0.1719em",
        "fontSize": "181.2389px",
        "lineHeight": "180px",
      }
    `);
  });

  it('should handle providing capHeight and lineGap', () => {
    const options = {
      capHeight: 120,
      lineGap: 30,
      fontMetrics: {
        capHeight: 1356,
        ascent: 1825,
        descent: -443,
        lineGap: 87,
        unitsPerEm: 2048,
      },
    };
    expect(precomputeValues(options)).toMatchInlineSnapshot(`
      {
        "baselineTrim": "-0.0764em",
        "capHeightTrim": "-0.0891em",
        "fontSize": "181.2389px",
        "lineHeight": "150px",
      }
    `);
  });

  it('should handle providing capHeight only', () => {
    const options = {
      capHeight: 120,
      fontMetrics: {
        capHeight: 1356,
        ascent: 1825,
        descent: -443,
        lineGap: 87,
        unitsPerEm: 2048,
      },
    };
    expect(precomputeValues(options)).toMatchInlineSnapshot(`
      {
        "baselineTrim": "-0.2375em",
        "capHeightTrim": "-0.2502em",
        "fontSize": "181.2389px",
        "lineHeight": "normal",
      }
    `);
  });
});
