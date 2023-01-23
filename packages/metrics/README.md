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

| Property   | Type   | Description                                                                                                                                                                                                   |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| familyName | string | Font family name as authored by font creator                                                                                                                                                                  |
| category   | string | Style of the font: serif, sans-serif, monospace, display, or handwriting.<br/><br/>Value is calculated based on [character weightings], and falling back to the built in [xAvgCharWidth] from the OS/2 table. |
| capHeight  | number | The height of capital letters above the baseline                                                                                                                                                              |
| ascent     | number | The height of the ascenders above baseline                                                                                                                                                                    |
| descent    | number | The descent of the descenders below baseline                                                                                                                                                                  |
| lineGap    | number | The amount of space included between lines                                                                                                                                                                    |
| unitsPerEm | number | The size of the font’s internal coordinate grid                                                                                                                                                               |
| xHeight    | number | The height of lower case letters above the baseline                                                                                                                                                           |
| xWidthAvg  | number | The average width of lowercase characters (currently calculated based on latin character frequency weightings)                                                                                                |

[character weightings]: https://en.wikipedia.org/wiki/Letter_frequency#Relative_frequencies_of_letters_in_other_languages
[xavgcharwidth]: https://learn.microsoft.com/en-us/typography/opentype/spec/os2#xavgcharwidth

## Thanks

- [SEEK](https://www.seek.com.au) for giving us the space to do interesting work.

## License

MIT.
