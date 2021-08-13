import { createStyleObject } from './createStyleObject';

const fontMetrics = {
  capHeight: 1356,
  ascent: 1825,
  descent: -443,
  lineGap: 87,
  unitsPerEm: 2048,
};

describe('createStyleObject', () => {
  it('handle options', () => {
    const options = {
      fontSize: 150,
      leading: 180,
      fontMetrics,
    };
    expect(createStyleObject(options)).toMatchInlineSnapshot(`
Object {
  "::after": Object {
    "content": "''",
    "display": "table",
    "marginTop": "-0.2626em",
  },
  "::before": Object {
    "content": "''",
    "display": "table",
    "marginBottom": "-0.2753em",
  },
  "fontSize": "150px",
  "lineHeight": "180px",
}
`);
  });

  it('handle options without leading or lineGap option', () => {
    const options = {
      fontSize: 150,
      fontMetrics,
    };
    expect(createStyleObject(options)).toMatchInlineSnapshot(`
Object {
  "::after": Object {
    "content": "''",
    "display": "table",
    "marginTop": "-0.2375em",
  },
  "::before": Object {
    "content": "''",
    "display": "table",
    "marginBottom": "-0.2502em",
  },
  "fontSize": "150px",
  "lineHeight": "normal",
}
`);
  });

  it('handle values', () => {
    const values = {
      fontSize: '150px',
      lineHeight: '180px',
      capHeightTrim: '-0.2753em',
      baselineTrim: '-0.2626em',
    };
    expect(createStyleObject(values)).toMatchInlineSnapshot(`
Object {
  "::after": Object {
    "content": "''",
    "display": "table",
    "marginTop": "-0.2626em",
  },
  "::before": Object {
    "content": "''",
    "display": "table",
    "marginBottom": "-0.2753em",
  },
  "fontSize": "150px",
  "lineHeight": "180px",
}
`);
  });
});
