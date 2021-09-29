import { precomputeNumericValues } from '.';

describe('precomputeNumericValues', () => {
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
    expect(precomputeNumericValues(options)).toMatchInlineSnapshot(`
Object {
  "baselineTrimEm": -0.26259765625,
  "capHeightTrimEm": -0.27529296875,
  "fontSize": 150,
  "lineHeight": 180,
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
    expect(precomputeNumericValues(options)).toMatchInlineSnapshot(`
Object {
  "baselineTrimEm": -0.09365234375,
  "capHeightTrimEm": -0.10634765625,
  "fontSize": 150,
  "lineHeight": 129.31640625,
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
    expect(precomputeNumericValues(options)).toMatchInlineSnapshot(`
Object {
  "baselineTrimEm": -0.237548828125,
  "capHeightTrimEm": -0.250244140625,
  "fontSize": 150,
  "lineHeight": undefined,
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
    expect(precomputeNumericValues(options)).toMatchInlineSnapshot(`
Object {
  "baselineTrimEm": -0.15917968749999997,
  "capHeightTrimEm": -0.17187499999999997,
  "fontSize": 181.23893805309734,
  "lineHeight": 180,
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
    expect(precomputeNumericValues(options)).toMatchInlineSnapshot(`
Object {
  "baselineTrimEm": -0.07641601562499997,
  "capHeightTrimEm": -0.08911132812499997,
  "fontSize": 181.23893805309734,
  "lineHeight": 150,
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
    expect(precomputeNumericValues(options)).toMatchInlineSnapshot(`
Object {
  "baselineTrimEm": -0.237548828125,
  "capHeightTrimEm": -0.250244140625,
  "fontSize": 181.23893805309734,
  "lineHeight": undefined,
}
`);
  });
});
