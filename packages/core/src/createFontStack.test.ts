import { createFontStack, quoteIfNeeded } from './createFontStack';
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

  it('metric overrides with a single fallback - no line gap in preferred font', () => {
    expect(createFontStack([merriweatherSans, arial])).toMatchInlineSnapshot(`
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
        "fontFacesAsCss": "@font-face {
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
        "fontFacesAsCss": "@font-face {
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
      createFontStack([merriweatherSans, appleSystem, arial, helveticaNeue]),
    ).toMatchInlineSnapshot(`
      {
        "fontFaces": [
          {
            "@font-face": {
              "ascentOverride": "98.4%",
              "descentOverride": "27.3%",
              "fontFamily": "'Merriweather Sans Fallback'",
              "src": "local('-apple-system'), local('Arial'), local('Helvetica Neue')",
            },
          },
        ],
        "fontFacesAsCss": "@font-face {
        font-family: 'Merriweather Sans Fallback';
        src: local('-apple-system'), local('Arial'), local('Helvetica Neue');
        ascent-override: 98.4%;
        descent-override: 27.3%;
      }",
        "fontFamily": "'Merriweather Sans', 'Merriweather Sans Fallback'",
      }
    `);
  });

  it('size adjust', () => {
    expect(
      createFontStack([merriweatherSans, appleSystem, arial, helveticaNeue], {
        sizeAdjust: 'xAvgLetterFrequency',
      }),
    ).toMatchInlineSnapshot(`
      {
        "fontFaces": [
          {
            "@font-face": {
              "ascentOverride": "88.6915%",
              "descentOverride": "24.6065%",
              "fontFamily": "'Merriweather Sans Fallback: -apple-system'",
              "sizeAdjust": "110.9464%",
              "src": "local('-apple-system')",
            },
          },
          {
            "@font-face": {
              "ascentOverride": "94.557%",
              "descentOverride": "26.2338%",
              "fontFamily": "'Merriweather Sans Fallback: Arial'",
              "sizeAdjust": "104.0642%",
              "src": "local('Arial')",
            },
          },
          {
            "@font-face": {
              "ascentOverride": "46.8234%",
              "descentOverride": "12.9906%",
              "fontFamily": "'Merriweather Sans Fallback: Helvetica Neue'",
              "sizeAdjust": "210.1512%",
              "src": "local('Helvetica Neue')",
            },
          },
        ],
        "fontFacesAsCss": "@font-face {
        font-family: 'Merriweather Sans Fallback: -apple-system';
        src: local('-apple-system');
        ascent-override: 88.6915%;
        descent-override: 24.6065%;
        size-adjust: 110.9464%;
      }
      @font-face {
        font-family: 'Merriweather Sans Fallback: Arial';
        src: local('Arial');
        ascent-override: 94.557%;
        descent-override: 26.2338%;
        size-adjust: 104.0642%;
      }
      @font-face {
        font-family: 'Merriweather Sans Fallback: Helvetica Neue';
        src: local('Helvetica Neue');
        ascent-override: 46.8234%;
        descent-override: 12.9906%;
        size-adjust: 210.1512%;
      }",
        "fontFamily": "'Merriweather Sans', 'Merriweather Sans Fallback: -apple-system', 'Merriweather Sans Fallback: Arial', 'Merriweather Sans Fallback: Helvetica Neue'",
      }
    `);
  });
});
