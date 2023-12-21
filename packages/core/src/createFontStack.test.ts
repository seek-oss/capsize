import {
  createFontStack,
  quoteIfNeeded,
  toCssProperty,
} from './createFontStack';
const merriweatherSans = {
  familyName: 'Merriweather Sans',
  ascent: 1968,
  descent: -546,
  lineGap: 0,
  unitsPerEm: 2000,
  xWidthAvg: 973,
};
const appleSystem = {
  familyName: '-apple-system',
  ascent: 1950,
  descent: -420,
  lineGap: 0,
  unitsPerEm: 2048,
  xWidthAvg: 877,
};
const arial = {
  familyName: 'Arial',
  ascent: 1854,
  descent: -434,
  lineGap: 67,
  unitsPerEm: 2048,
  xWidthAvg: 935,
};
const helveticaNeue = {
  familyName: 'Helvetica Neue',
  ascent: 952,
  descent: -213,
  lineGap: 28,
  unitsPerEm: 1000,
  xWidthAvg: 463,
};

describe('createFontStack', () => {
  it('quoteIfNeeded', () => {
    [
      // Test cases from MDN:
      // https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#valid_family_names
      { input: `"Goudy Bookletter 1911"`, output: `"Goudy Bookletter 1911"` },
      { input: `Goudy Bookletter 1911`, output: `"Goudy Bookletter 1911"` },
      { input: `Red/Black`, output: `"Red/Black"` },
      { input: `Ahem!`, output: `"Ahem!"` },
      { input: `test@foo`, output: `"test@foo"` },
      { input: `#POUND`, output: `"#POUND"` },
      { input: `Hawaii 5-0`, output: `"Hawaii 5-0"` },
      // Additional tests:
      { input: `sans-serif`, output: `sans-serif` },
      { input: `asdasdasd`, output: `asdasdasd` },
      {
        input: `'Normalise single quoted to double'`,
        output: `"Normalise single quoted to double"`,
      },
      {
        input: `Single quote in middle ' of unquoted`,
        output: `"Single quote in middle ' of unquoted"`,
      },
      {
        input: `'Single quote in middle ' of single quoted'`,
        output: `"Single quote in middle \' of single quoted"`,
      },
      {
        input: `"Single quote in middle ' of double quoted"`,
        output: `"Single quote in middle ' of double quoted"`,
      },
      {
        input: `Double quote in " middle of unquoted`,
        output: `"Double quote in \" middle of unquoted"`,
      },
      {
        input: `'Double quote in " middle of single quoted'`,
        output: `"Double quote in \" middle of single quoted"`,
      },
      {
        input: `"Double quote in " middle of double quoted"`,
        output: `"Double quote in \" middle of double quoted"`,
      },
      { input: `"Lucida" Grande`, output: `"Lucida\" Grande"` },
      { input: `"Lucide`, output: `"Lucide"` },
      { input: `'Lucide`, output: `"\'Lucide"` },
    ].forEach(({ input, output }) =>
      expect(quoteIfNeeded(input)).toEqual(output),
    );
  });

  it('toCssProperty', () => {
    [
      { input: 'MozFontFeatureSettings', output: '-moz-font-feature-settings' },
      { input: 'ascentOverride', output: 'ascent-override' },
      { input: 'descentOverride', output: 'descent-override' },
      { input: 'fontDisplay', output: 'font-display' },
      { input: 'fontFamily', output: 'font-family' },
      { input: 'fontFeatureSettings', output: 'font-feature-settings' },
      { input: 'fontStretch', output: 'font-stretch' },
      { input: 'fontStyle', output: 'font-style' },
      { input: 'fontVariant', output: 'font-variant' },
      { input: 'fontVariationSettings', output: 'font-variation-settings' },
      { input: 'fontWeight', output: 'font-weight' },
      { input: 'lineGapOverride', output: 'line-gap-override' },
      { input: 'sizeAdjust', output: 'size-adjust' },
      { input: 'src', output: 'src' },
      { input: 'unicodeRange', output: 'unicode-range' },
    ].forEach(({ input, output }) =>
      expect(toCssProperty(input)).toEqual(output),
    );
  });

  describe('fontFaceFormat', () => {
    describe('default', () => {
      it('metric overrides with a single fallback - no line gap in preferred font', () => {
        expect(createFontStack([merriweatherSans, arial]))
          .toMatchInlineSnapshot(`
          {
            "fontFaces": "@font-face {
            font-family: "Merriweather Sans Fallback";
            src: local('Arial');
            ascent-override: 92.3409%;
            descent-override: 25.619%;
            size-adjust: 106.5617%;
          }",
            "fontFamily": ""Merriweather Sans", "Merriweather Sans Fallback", Arial",
          }
        `);
      });

      it('metric overrides with a single fallback - with line gap in preferred font', () => {
        expect(createFontStack([arial, helveticaNeue])).toMatchInlineSnapshot(`
          {
            "fontFaces": "@font-face {
            font-family: "Arial Fallback";
            src: local('Helvetica Neue');
            ascent-override: 91.8077%;
            descent-override: 21.4911%;
            line-gap-override: 3.3178%;
            size-adjust: 98.6054%;
          }",
            "fontFamily": "Arial, "Arial Fallback", "Helvetica Neue"",
          }
        `);
      });

      it('metric overrides with multiple fallbacks', () => {
        expect(
          createFontStack([
            merriweatherSans,
            appleSystem,
            arial,
            helveticaNeue,
          ]),
        ).toMatchInlineSnapshot(`
          {
            "fontFaces": "@font-face {
            font-family: "Merriweather Sans Fallback: -apple-system";
            src: local('-apple-system');
            ascent-override: 86.6128%;
            descent-override: 24.0298%;
            size-adjust: 113.6091%;
          }
          @font-face {
            font-family: "Merriweather Sans Fallback: Arial";
            src: local('Arial');
            ascent-override: 92.3409%;
            descent-override: 25.619%;
            size-adjust: 106.5617%;
          }
          @font-face {
            font-family: "Merriweather Sans Fallback: Helvetica Neue";
            src: local('Helvetica Neue');
            ascent-override: 93.6469%;
            descent-override: 25.9813%;
            size-adjust: 105.0756%;
          }",
            "fontFamily": ""Merriweather Sans", "Merriweather Sans Fallback: -apple-system", "Merriweather Sans Fallback: Arial", "Merriweather Sans Fallback: Helvetica Neue", -apple-system, Arial, "Helvetica Neue"",
          }
        `);
      });
    });

    describe('styleObject', () => {
      it('metric overrides with a single fallback - no line gap in preferred font', () => {
        expect(
          createFontStack([merriweatherSans, arial], {
            fontFaceFormat: 'styleObject',
          }),
        ).toMatchInlineSnapshot(`
          {
            "fontFaces": [
              {
                "@font-face": {
                  "ascentOverride": "92.3409%",
                  "descentOverride": "25.619%",
                  "fontFamily": ""Merriweather Sans Fallback"",
                  "sizeAdjust": "106.5617%",
                  "src": "local('Arial')",
                },
              },
            ],
            "fontFamily": ""Merriweather Sans", "Merriweather Sans Fallback", Arial",
          }
        `);
      });

      it('metric overrides with a single fallback - with line gap in preferred font', () => {
        expect(
          createFontStack([arial, helveticaNeue], {
            fontFaceFormat: 'styleObject',
          }),
        ).toMatchInlineSnapshot(`
          {
            "fontFaces": [
              {
                "@font-face": {
                  "ascentOverride": "91.8077%",
                  "descentOverride": "21.4911%",
                  "fontFamily": ""Arial Fallback"",
                  "lineGapOverride": "3.3178%",
                  "sizeAdjust": "98.6054%",
                  "src": "local('Helvetica Neue')",
                },
              },
            ],
            "fontFamily": "Arial, "Arial Fallback", "Helvetica Neue"",
          }
        `);
      });

      it('metric overrides with multiple fallbacks', () => {
        expect(
          createFontStack(
            [merriweatherSans, appleSystem, arial, helveticaNeue],
            {
              fontFaceFormat: 'styleObject',
            },
          ),
        ).toMatchInlineSnapshot(`
          {
            "fontFaces": [
              {
                "@font-face": {
                  "ascentOverride": "86.6128%",
                  "descentOverride": "24.0298%",
                  "fontFamily": ""Merriweather Sans Fallback: -apple-system"",
                  "sizeAdjust": "113.6091%",
                  "src": "local('-apple-system')",
                },
              },
              {
                "@font-face": {
                  "ascentOverride": "92.3409%",
                  "descentOverride": "25.619%",
                  "fontFamily": ""Merriweather Sans Fallback: Arial"",
                  "sizeAdjust": "106.5617%",
                  "src": "local('Arial')",
                },
              },
              {
                "@font-face": {
                  "ascentOverride": "93.6469%",
                  "descentOverride": "25.9813%",
                  "fontFamily": ""Merriweather Sans Fallback: Helvetica Neue"",
                  "sizeAdjust": "105.0756%",
                  "src": "local('Helvetica Neue')",
                },
              },
            ],
            "fontFamily": ""Merriweather Sans", "Merriweather Sans Fallback: -apple-system", "Merriweather Sans Fallback: Arial", "Merriweather Sans Fallback: Helvetica Neue", -apple-system, Arial, "Helvetica Neue"",
          }
        `);
      });
    });

    describe('styleString', () => {
      it('metric overrides with a single fallback - no line gap in preferred font', () => {
        expect(
          createFontStack([merriweatherSans, arial], {
            fontFaceFormat: 'styleString',
          }),
        ).toMatchInlineSnapshot(`
          {
            "fontFaces": "@font-face {
            font-family: "Merriweather Sans Fallback";
            src: local('Arial');
            ascent-override: 92.3409%;
            descent-override: 25.619%;
            size-adjust: 106.5617%;
          }",
            "fontFamily": ""Merriweather Sans", "Merriweather Sans Fallback", Arial",
          }
        `);
      });

      it('metric overrides with a single fallback - with line gap in preferred font', () => {
        expect(
          createFontStack([arial, helveticaNeue], {
            fontFaceFormat: 'styleString',
          }),
        ).toMatchInlineSnapshot(`
          {
            "fontFaces": "@font-face {
            font-family: "Arial Fallback";
            src: local('Helvetica Neue');
            ascent-override: 91.8077%;
            descent-override: 21.4911%;
            line-gap-override: 3.3178%;
            size-adjust: 98.6054%;
          }",
            "fontFamily": "Arial, "Arial Fallback", "Helvetica Neue"",
          }
        `);
      });

      it('metric overrides with multiple fallbacks', () => {
        expect(
          createFontStack(
            [merriweatherSans, appleSystem, arial, helveticaNeue],
            {
              fontFaceFormat: 'styleString',
            },
          ),
        ).toMatchInlineSnapshot(`
          {
            "fontFaces": "@font-face {
            font-family: "Merriweather Sans Fallback: -apple-system";
            src: local('-apple-system');
            ascent-override: 86.6128%;
            descent-override: 24.0298%;
            size-adjust: 113.6091%;
          }
          @font-face {
            font-family: "Merriweather Sans Fallback: Arial";
            src: local('Arial');
            ascent-override: 92.3409%;
            descent-override: 25.619%;
            size-adjust: 106.5617%;
          }
          @font-face {
            font-family: "Merriweather Sans Fallback: Helvetica Neue";
            src: local('Helvetica Neue');
            ascent-override: 93.6469%;
            descent-override: 25.9813%;
            size-adjust: 105.0756%;
          }",
            "fontFamily": ""Merriweather Sans", "Merriweather Sans Fallback: -apple-system", "Merriweather Sans Fallback: Arial", "Merriweather Sans Fallback: Helvetica Neue", -apple-system, Arial, "Helvetica Neue"",
          }
        `);
      });
    });
  });

  describe('metric overrides', () => {
    it('with same metrics', () => {
      expect(createFontStack([arial, arial])).toMatchInlineSnapshot(`
        {
          "fontFaces": "@font-face {
          font-family: "Arial Fallback";
          src: local('Arial');
        }",
          "fontFamily": "Arial, "Arial Fallback", Arial",
        }
      `);
    });
  });

  describe('fontFaceProperties', () => {
    it('with a single fallback', () =>
      expect(
        createFontStack([merriweatherSans, arial], {
          fontFaceProperties: { fontDisplay: 'swap' },
        }),
      ).toMatchInlineSnapshot(`
        {
          "fontFaces": "@font-face {
          font-family: "Merriweather Sans Fallback";
          src: local('Arial');
          font-display: swap;
          ascent-override: 92.3409%;
          descent-override: 25.619%;
          size-adjust: 106.5617%;
        }",
          "fontFamily": ""Merriweather Sans", "Merriweather Sans Fallback", Arial",
        }
      `));

    it('with a multiple fallbacks', () => {
      expect(
        createFontStack([merriweatherSans, appleSystem, arial, helveticaNeue], {
          fontFaceProperties: { fontDisplay: 'swap' },
        }),
      ).toMatchInlineSnapshot(`
        {
          "fontFaces": "@font-face {
          font-family: "Merriweather Sans Fallback: -apple-system";
          src: local('-apple-system');
          font-display: swap;
          ascent-override: 86.6128%;
          descent-override: 24.0298%;
          size-adjust: 113.6091%;
        }
        @font-face {
          font-family: "Merriweather Sans Fallback: Arial";
          src: local('Arial');
          font-display: swap;
          ascent-override: 92.3409%;
          descent-override: 25.619%;
          size-adjust: 106.5617%;
        }
        @font-face {
          font-family: "Merriweather Sans Fallback: Helvetica Neue";
          src: local('Helvetica Neue');
          font-display: swap;
          ascent-override: 93.6469%;
          descent-override: 25.9813%;
          size-adjust: 105.0756%;
        }",
          "fontFamily": ""Merriweather Sans", "Merriweather Sans Fallback: -apple-system", "Merriweather Sans Fallback: Arial", "Merriweather Sans Fallback: Helvetica Neue", -apple-system, Arial, "Helvetica Neue"",
        }
      `);
    });
  });

  describe('size-adjust', () => {
    it('with a single fallback', () => {
      expect(
        createFontStack([
          { ...merriweatherSans, xWidthAvg: 973 },
          { ...arial, xWidthAvg: 935 },
        ]),
      ).toMatchInlineSnapshot(`
        {
          "fontFaces": "@font-face {
          font-family: "Merriweather Sans Fallback";
          src: local('Arial');
          ascent-override: 92.3409%;
          descent-override: 25.619%;
          size-adjust: 106.5617%;
        }",
          "fontFamily": ""Merriweather Sans", "Merriweather Sans Fallback", Arial",
        }
      `);
    });

    it('with multiple fallbacks', () => {
      expect(
        createFontStack([
          { ...merriweatherSans, xWidthAvg: 973 },
          { ...appleSystem, xWidthAvg: 877 },
          { ...arial, xWidthAvg: 935 },
          { ...helveticaNeue, xWidthAvg: 463 },
        ]),
      ).toMatchInlineSnapshot(`
        {
          "fontFaces": "@font-face {
          font-family: "Merriweather Sans Fallback: -apple-system";
          src: local('-apple-system');
          ascent-override: 86.6128%;
          descent-override: 24.0298%;
          size-adjust: 113.6091%;
        }
        @font-face {
          font-family: "Merriweather Sans Fallback: Arial";
          src: local('Arial');
          ascent-override: 92.3409%;
          descent-override: 25.619%;
          size-adjust: 106.5617%;
        }
        @font-face {
          font-family: "Merriweather Sans Fallback: Helvetica Neue";
          src: local('Helvetica Neue');
          ascent-override: 93.6469%;
          descent-override: 25.9813%;
          size-adjust: 105.0756%;
        }",
          "fontFamily": ""Merriweather Sans", "Merriweather Sans Fallback: -apple-system", "Merriweather Sans Fallback: Arial", "Merriweather Sans Fallback: Helvetica Neue", -apple-system, Arial, "Helvetica Neue"",
        }
      `);
    });

    it('with custom size-adjust override', () => {
      expect(
        createFontStack(
          [
            { ...merriweatherSans, xWidthAvg: 973 },
            { ...arial, xWidthAvg: 935 },
          ],

          { fontFaceProperties: { sizeAdjust: '300%' } },
        ),
      ).toMatchInlineSnapshot(`
        {
          "fontFaces": "@font-face {
          font-family: "Merriweather Sans Fallback";
          src: local('Arial');
          size-adjust: 300%;
          ascent-override: 92.3409%;
          descent-override: 25.619%;
        }",
          "fontFamily": ""Merriweather Sans", "Merriweather Sans Fallback", Arial",
        }
      `);
    });
  });
});
