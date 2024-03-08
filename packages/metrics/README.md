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

| Property   | Type                                        | Description                                                                                                                                                                                                                   |
| ---------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| familyName | string                                      | The font family name as authored by font creator                                                                                                                                                                              |
| category   | string                                      | The style of the font: serif, sans-serif, monospace, display, or handwriting.                                                                                                                                                 |
| capHeight  | number                                      | The height of capital letters above the baseline                                                                                                                                                                              |
| ascent     | number                                      | The height of the ascenders above baseline                                                                                                                                                                                    |
| descent    | number                                      | The descent of the descenders below baseline                                                                                                                                                                                  |
| lineGap    | number                                      | The amount of space included between lines                                                                                                                                                                                    |
| unitsPerEm | number                                      | The size of the font’s internal coordinate grid                                                                                                                                                                               |
| xHeight    | number                                      | The height of the main body of lower case letters above baseline                                                                                                                                                              |
| xWidthAvg  | number                                      | The average width of character glyphs in the font for the selected unicode subset. Calculated based on character frequencies in written text ([see below]), falling back to the built in [xAvgCharWidth] from the OS/2 table. |
| subsets    | {<br/>[subset]: { xWidthAvg: number }<br/>} | A lookup of the `xWidthAvg` metric by subset (see [supported subsets below])                                                                                                                                                  |

[supported subsets below]: #subsets

#### How `xWidthAvg` is calculated

The `xWidthAvg` metric is derived from character frequencies in written language.
The value takes a weighted average of character glyph widths in the font, falling back to the built in [xAvgCharWidth] from the OS/2 table if the glyph width is not available.

The purpose of this metric is to support generating CSS metric overrides (e.g. [`ascent-override`], [`size-adjust`], etc) for fallback fonts, enabling inference of average line lengths so that a fallback font can be scaled to better align with a web font. This can be done either manually or using [`createFontStack`].

For this technique to be effective, the metric factors in a character frequency weightings as observed in written language, using “abstracts” from [Wikinews] articles as a data source.
Below is the source analysed for each supported subset:

| Subset  | Language                                     |
| ------- | -------------------------------------------- |
| `latin` | English ([source](https://en.wikinews.org/)) |
| `thai`  | Thai ([source](https://th.wikinews.org/))    |

> [!TIP]
> Need support for a different unicode subset?
> Either create an issue or follow the steps outlined in the [`generate-weightings` script] in the `unpack` package and open a PR.

For more information on how to access the metrics for different subsets, see the [subsets](#subsets) section below.

[`generate-weightings` script]: ../unpack/scripts/generate-weightings.ts
[see below]: #how-xwidthavg-is-calculated
[xavgcharwidth]: https://learn.microsoft.com/en-us/typography/opentype/spec/os2#xavgcharwidth
[`ascent-override`]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/ascent-override
[`size-adjust`]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust
[`createfontstack`]: ../core/README.md#createfontstack
[wikinews]: https://www.wikinews.org/

## Subsets

The top level `xWidthAvg` metric represents the average character width for the `latin` subset. However, the `xWidthAvg` for each supported subset is available explicitly within the `subsets` field.

For example:

```ts
import arial from '@capsizecss/metrics/arial';

const xWidthAvgDefault = arial.xWidthAvg;
const xWidthAvgLatin = arial.subsets.latin.xWidthAvg; // Same as above
const xWidthAvgThai = arial.subsets.thai.xWidthAvg;
```

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
