import { createStyleString } from './createStyleString';

describe('createStyleString', () => {
  it('handle capsize options', () => {
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
    expect(createStyleString('testClassName', options)).toMatchInlineSnapshot(`
      "
      .testClassName {
        font-size: 150px;
        line-height: 180px;
      }

      .testClassName::before {
        content: "";
        margin-block-end: -0.2753em;
        display: table;
      }

      .testClassName::after {
        content: "";
        margin-block-start: -0.2626em;
        display: table;
      }"
    `);
  });

  it('handle capsize values', () => {
    const values = {
      fontSize: '150px',
      lineHeight: '180px',
      capHeightTrim: '-0.2753em',
      baselineTrim: '-0.2626em',
    };
    expect(createStyleString('testClassName', values)).toMatchInlineSnapshot(`
      "
      .testClassName {
        font-size: 150px;
        line-height: 180px;
      }

      .testClassName::before {
        content: "";
        margin-block-end: -0.2753em;
        display: table;
      }

      .testClassName::after {
        content: "";
        margin-block-start: -0.2626em;
        display: table;
      }"
    `);
  });
});
