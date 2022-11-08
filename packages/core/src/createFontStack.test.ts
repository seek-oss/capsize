import { createFontStack } from './createFontStack';
import merriweatherSans from '@capsizecss/metrics/merriweatherSans';
import appleSystem from '@capsizecss/metrics/appleSystem';
import arial from '@capsizecss/metrics/arial';
import helveticaNeue from '@capsizecss/metrics/helveticaNeue';

describe('createFontStack', () => {
  it('createFontStack', () => {
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
