import {
  createFontStack,
  quoteIfNeeded,
  toCssProperty,
} from './createFontStack';
import merriweatherSans from '@capsizecss/metrics/merriweatherSans';
import appleSystem from '@capsizecss/metrics/appleSystem';
import arial from '@capsizecss/metrics/arial';
import helveticaNeue from '@capsizecss/metrics/helveticaNeue';

describe('createFontStack', () => {
  it('quoteIfNeeded', () => {
    [
      { input: `Goudy Bookletter 1911`, output: `'Goudy Bookletter 1911'` },
      { input: `Red/Black`, output: `'Red/Black'` },
      { input: `"Lucida" Grande`, output: `'"Lucida" Grande'` },
      { input: `Ahem!`, output: `'Ahem!'` },
      { input: `test@foo`, output: `'test@foo'` },
      { input: `#POUND`, output: `'#POUND'` },
      { input: `Hawaii 5-0`, output: `'Hawaii 5-0'` },
      { input: `sans-serif`, output: `sans-serif` },
      { input: `asdasdasd`, output: `asdasdasd` },
      { input: `"Lucide Grande"`, output: `'"Lucide Grande"'` },
      { input: `"Lucide`, output: `'"Lucide'` },
      { input: `'Sasd asdasd'`, output: `''Sasd asdasd''` },
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
              font-family: 'Merriweather Sans Fallback';
              src: local('Arial');
              ascent-override: 98.4%;
              descent-override: 27.3%;
            }",
              "fontFamily": "'Merriweather Sans', 'Merriweather Sans Fallback'",
            }
        `);
      });

      it('metric overrides with a single fallback - with line gap in preferred font', () => {
        expect(createFontStack([arial, helveticaNeue])).toMatchInlineSnapshot(`
          {
            "fontFaces": "@font-face {
            font-family: 'Arial Fallback';
            src: local('Helvetica Neue');
            ascent-override: 90.5273%;
            descent-override: 21.1914%;
            line-gap-override: 3.2715%;
          }",
            "fontFamily": "Arial, 'Arial Fallback'",
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
            font-family: 'Merriweather Sans Fallback: -apple-system';
            src: local('-apple-system');
            ascent-override: 98.4%;
            descent-override: 27.3%;
          }
          @font-face {
            font-family: 'Merriweather Sans Fallback: Arial';
            src: local('Arial');
            ascent-override: 98.4%;
            descent-override: 27.3%;
          }
          @font-face {
            font-family: 'Merriweather Sans Fallback: Helvetica Neue';
            src: local('Helvetica Neue');
            ascent-override: 98.4%;
            descent-override: 27.3%;
          }",
            "fontFamily": "'Merriweather Sans', 'Merriweather Sans Fallback: -apple-system', 'Merriweather Sans Fallback: Arial', 'Merriweather Sans Fallback: Helvetica Neue'",
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
                  "ascentOverride": "98.4%",
                  "descentOverride": "27.3%",
                  "fontFamily": "'Merriweather Sans Fallback'",
                  "src": "local('Arial')",
                },
              },
            ],
            "fontFamily": "'Merriweather Sans', 'Merriweather Sans Fallback'",
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
                  "ascentOverride": "90.5273%",
                  "descentOverride": "21.1914%",
                  "fontFamily": "'Arial Fallback'",
                  "lineGapOverride": "3.2715%",
                  "src": "local('Helvetica Neue')",
                },
              },
            ],
            "fontFamily": "Arial, 'Arial Fallback'",
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
                  "ascentOverride": "98.4%",
                  "descentOverride": "27.3%",
                  "fontFamily": "'Merriweather Sans Fallback: -apple-system'",
                  "src": "local('-apple-system')",
                },
              },
              {
                "@font-face": {
                  "ascentOverride": "98.4%",
                  "descentOverride": "27.3%",
                  "fontFamily": "'Merriweather Sans Fallback: Arial'",
                  "src": "local('Arial')",
                },
              },
              {
                "@font-face": {
                  "ascentOverride": "98.4%",
                  "descentOverride": "27.3%",
                  "fontFamily": "'Merriweather Sans Fallback: Helvetica Neue'",
                  "src": "local('Helvetica Neue')",
                },
              },
            ],
            "fontFamily": "'Merriweather Sans', 'Merriweather Sans Fallback: -apple-system', 'Merriweather Sans Fallback: Arial', 'Merriweather Sans Fallback: Helvetica Neue'",
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
            font-family: 'Merriweather Sans Fallback';
            src: local('Arial');
            ascent-override: 98.4%;
            descent-override: 27.3%;
          }",
            "fontFamily": "'Merriweather Sans', 'Merriweather Sans Fallback'",
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
            font-family: 'Arial Fallback';
            src: local('Helvetica Neue');
            ascent-override: 90.5273%;
            descent-override: 21.1914%;
            line-gap-override: 3.2715%;
          }",
            "fontFamily": "Arial, 'Arial Fallback'",
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
            font-family: 'Merriweather Sans Fallback: -apple-system';
            src: local('-apple-system');
            ascent-override: 98.4%;
            descent-override: 27.3%;
          }
          @font-face {
            font-family: 'Merriweather Sans Fallback: Arial';
            src: local('Arial');
            ascent-override: 98.4%;
            descent-override: 27.3%;
          }
          @font-face {
            font-family: 'Merriweather Sans Fallback: Helvetica Neue';
            src: local('Helvetica Neue');
            ascent-override: 98.4%;
            descent-override: 27.3%;
          }",
            "fontFamily": "'Merriweather Sans', 'Merriweather Sans Fallback: -apple-system', 'Merriweather Sans Fallback: Arial', 'Merriweather Sans Fallback: Helvetica Neue'",
          }
        `);
      });
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
          font-family: 'Merriweather Sans Fallback';
          src: local('Arial');
          font-display: swap;
          ascent-override: 98.4%;
          descent-override: 27.3%;
        }",
          "fontFamily": "'Merriweather Sans', 'Merriweather Sans Fallback'",
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
          font-family: 'Merriweather Sans Fallback: -apple-system';
          src: local('-apple-system');
          font-display: swap;
          ascent-override: 98.4%;
          descent-override: 27.3%;
        }
        @font-face {
          font-family: 'Merriweather Sans Fallback: Arial';
          src: local('Arial');
          font-display: swap;
          ascent-override: 98.4%;
          descent-override: 27.3%;
        }
        @font-face {
          font-family: 'Merriweather Sans Fallback: Helvetica Neue';
          src: local('Helvetica Neue');
          font-display: swap;
          ascent-override: 98.4%;
          descent-override: 27.3%;
        }",
          "fontFamily": "'Merriweather Sans', 'Merriweather Sans Fallback: -apple-system', 'Merriweather Sans Fallback: Arial', 'Merriweather Sans Fallback: Helvetica Neue'",
        }
      `);
    });
  });

  describe('size-adjust', () => {
    it('with a single fallback', () => {
      expect(
        // @ts-expect-error `xWidthAvg` not yet available in metrics package
        createFontStack([
          { ...merriweatherSans, xWidthAvg: 973 },
          { ...arial, xWidthAvg: 935 },
        ]),
      ).toMatchInlineSnapshot(`
        {
          "fontFaces": "@font-face {
          font-family: 'Merriweather Sans Fallback';
          src: local('Arial');
          ascent-override: 92.3409%;
          descent-override: 25.619%;
          size-adjust: 106.5617%;
        }",
          "fontFamily": "'Merriweather Sans', 'Merriweather Sans Fallback'",
        }
      `);
    });

    it('with multiple fallbacks', () => {
      expect(
        // @ts-expect-error `xWidthAvg` not yet available in metrics package
        createFontStack([
          { ...merriweatherSans, xWidthAvg: 973 },
          { ...appleSystem, xWidthAvg: 877 },
          { ...arial, xWidthAvg: 935 },
          { ...helveticaNeue, xWidthAvg: 463 },
        ]),
      ).toMatchInlineSnapshot(`
        {
          "fontFaces": "@font-face {
          font-family: 'Merriweather Sans Fallback: -apple-system';
          src: local('-apple-system');
          ascent-override: 86.6128%;
          descent-override: 24.0298%;
          size-adjust: 113.6091%;
        }
        @font-face {
          font-family: 'Merriweather Sans Fallback: Arial';
          src: local('Arial');
          ascent-override: 92.3409%;
          descent-override: 25.619%;
          size-adjust: 106.5617%;
        }
        @font-face {
          font-family: 'Merriweather Sans Fallback: Helvetica Neue';
          src: local('Helvetica Neue');
          ascent-override: 93.6469%;
          descent-override: 25.9813%;
          size-adjust: 105.0756%;
        }",
          "fontFamily": "'Merriweather Sans', 'Merriweather Sans Fallback: -apple-system', 'Merriweather Sans Fallback: Arial', 'Merriweather Sans Fallback: Helvetica Neue'",
        }
      `);
    });
  });
});
