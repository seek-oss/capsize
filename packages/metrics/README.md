<img src="https://raw.githubusercontent.com/seek-oss/capsize/HEAD/images/capsize-header.png" alt="Capsize" title="Capsize" width="443px" />
<br/>

# @capsizecss/metrics

Font metrics library for system and Google fonts.

```bash
npm install @capsizecss/metrics
```

## Usage

Import the metrics for your chosen font to pass them directly into [capsize](../core/README.md#createstyleobject).

```ts
import { createStyleObject } from '@capsizecss/core';
import arialMetrics from '@capsizecss/metrics/arial';

const capsizeStyles = createStyleObject({
  fontSize: 16,
  leading: 24,
  fontMetrics: arialMetrics,
});
```

In addition to common system fonts, Google fonts are also supported.

```ts
import { createStyleObject } from '@capsizecss/core';
import lobsterMetrics from '@capsizecss/metrics/lobster';

const capsizeStyles = createStyleObject({
  fontSize: 16,
  leading: 24,
  fontMetrics: lobsterMetrics,
});
```

## Font metrics

The font metrics object returned contains the following properties if available:

| Property   | Type   | Description                                                                                                                                                                                   |
| ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| familyName | string | The font family name as authored by font creator                                                                                                                                              |
| category   | string | The style of the font: serif, sans-serif, monospace, display, or handwriting.                                                                                                                 |
| capHeight  | number | The height of capital letters above the baseline                                                                                                                                              |
| ascent     | number | The height of the ascenders above baseline                                                                                                                                                    |
| descent    | number | The descent of the descenders below baseline                                                                                                                                                  |
| lineGap    | number | The amount of space included between lines                                                                                                                                                    |
| unitsPerEm | number | The size of the font’s internal coordinate grid                                                                                                                                               |
| xHeight    | number | The height of the main body of lower case letters above baseline                                                                                                                              |
| xWidthAvg  | number | The average width of character glyphs in the font. Calculated based on character frequencies in written text ([see below]), falling back to the built in [xAvgCharWidth] from the OS/2 table. |

#### How `xWidthAvg` is calculated

The `xWidthAvg` metric is derived from character frequencies in written language.
The value takes a weighted average of character glyph widths in the font, falling back to the built in [xAvgCharWidth] from the OS/2 table if the glyph width is not available.

The purpose of this metric is to support generating CSS metric overrides (e.g. [`ascent-override`], [`size-adjust`], etc) for fallback fonts, enabling inference of average line lengths so that a fallback font can be scaled to better align with a web font. This can be done either manually or using [`createFontStack`].

For this technique to be effective, the metric factors in a character frequency weightings as observed in written language, using “abstracts” from [Wikinews] articles as a data source.
Currently only supporting English ([source](https://en.wikinews.org/)).

[see below]: #how-xwidthavg-is-calculated
[xavgcharwidth]: https://learn.microsoft.com/en-us/typography/opentype/spec/os2#xavgcharwidth
[`ascent-override`]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/ascent-override
[`size-adjust`]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust
[`createfontstack`]: ../core/README.md#createfontstack
[wikinews]: https://www.wikinews.org/

## Supporting APIs

### `fontFamilyToCamelCase`

A helper function to support tooling that needs to convert the font family name to the correct casing for the relevant metrics import.

```ts
import { fontFamilyToCamelCase } from '@capsizecss/metrics';

const familyName = fontFamilyToCamelCase('--apple-system'); // => `appleSystem`
const metrics = await import(`@capsizecss/metrics/${familyName}`);
```

### `entireMetricsCollection`

Provides the entire metrics collection as a JSON object, keyed by font family name.

---

**⚠️ CAUTION: Importing this will result in a _large JSON structure_ being pulled into your project!**

**It is not recommended to use this client side.**

---

```ts
import { entireMetricsCollection } from '@capsizecss/metrics/entireMetricsCollection';

const metrics = entireMetricsCollection['arial'];
```

## Thanks

- [SEEK](https://www.seek.com.au) for giving us the space to do interesting work.

## License

MIT.
