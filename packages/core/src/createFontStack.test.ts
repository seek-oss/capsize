import { createFontStack } from './createFontStack';
import merriweatherSans from '@capsizecss/metrics/merriweatherSans';
import arial from '@capsizecss/metrics/arial';
import helvetica from '@capsizecss/metrics/helvetica';

describe('createFontStack', () => {
  it('createFontStack', () => {
    expect(createFontStack([merriweatherSans, arial, helvetica]))
      .toMatchInlineSnapshot(`
      {
        "fontFaces": [
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
              "fontFamily": "'Merriweather Sans Fallback: Helvetica'",
              "src": "local('Helvetica')",
            },
          },
        ],
        "fontFacesAsCss": "@font-face {
        font-family: 'Merriweather Sans Fallback: Arial';
        src: local('Arial');
        ascent-override: 98.4%;
        descent-override: 27.3%;
      }
      @font-face {
        font-family: 'Merriweather Sans Fallback: Helvetica';
        src: local('Helvetica');
        ascent-override: 98.4%;
        descent-override: 27.3%;
      }",
        "fontFamily": "'Merriweather Sans', 'Merriweather Sans Fallback: Arial', 'Merriweather Sans Fallback: Helvetica'",
      }
    `);
  });
});
