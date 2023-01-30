<img src="https://raw.githubusercontent.com/seek-oss/capsize/HEAD/images/capsize-header.png#gh-light-mode-only" alt="Capsize" title="Capsize" width="443px" />
<img src="https://raw.githubusercontent.com/seek-oss/capsize/HEAD/images/capsize-header-inverted.png#gh-dark-mode-only" alt="Capsize" title="Capsize" width="443px" />
<br/>

> Capsize makes the sizing and layout of text as predictable as every other element on the screen.
>
> Using font metadata, text can now be sized according to the height of its capital letters while trimming the space above capital letters and below the baseline.

```bash
npm install @capsizecss/core
```

- [Usage](#usage)
  - [createStyleObject](#createstyleobject)
  - [createStyleString](#createstylestring)
- [Options](#options)
  - [Text size](#text-size)
  - [Line height](#line-height)
  - [Font Metrics](#font-metrics)
- [Core](#core)
  - [precomputeValues](#precomputevalues)
  - [getCapHeight](#getcapheight)
- [Metrics](#metrics)
- [Unpack](#unpack)
- [Integrations](#integrations)
  - [vanilla-extract](packages/vanilla-extract/README.md)

## Usage

### `createStyleObject`

Returns a CSS-in-JS style object.

1. Import `createStyleObject` passing the relevant [options](#options).

```ts
import { createStyleObject } from '@capsizecss/core';

const capsizeStyles = createStyleObject({
  fontSize: 16,
  leading: 24,
  fontMetrics: {
    capHeight: 700,
    ascent: 1058,
    descent: -291,
    lineGap: 0,
    unitsPerEm: 1000,
  },
});
```

Note: It is recommended that you install the [@capsizecss/metrics](packages/metrics/README.md) package and import the metrics from there:

```ts
import { createStyleObject } from '@capsizecss/core';
import arialMetrics from '@capsizecss/metrics/arial';

const capsizeStyles = createStyleObject({
  fontSize: 16,
  leading: 24,
  fontMetrics: arialMetrics,
});
```

See the [fontMetrics](#font-metrics) option documented below for more ways to obtain these metrics.

2. Apply styles to the text element, for example via the `css` prop.

```ts
<div
  css={{
    // fontFamily: '...' etc,
    ...capsizeStyles,
  }}
>
  My capsized text 🛶
</div>
```

### `createStyleString`

Returns a CSS string that can be inserted into a `style` tag or appended to a stylesheet.

1. Import `createStyleString` passing the relevant [options](#options).

```ts
import { createStyleString } from '@capsizecss/core';
import arialMetrics from '@capsizecss/metrics/arial';

const capsizedStyleRule = createStyleString('capsizedText', {
  fontSize: 16,
  leading: 24,
  fontMetrics: arialMetrics,
});
```

2. Add the styles into a stylesheet or `style` element and apply the specified class name.

```ts
document.write(`
  <style type="text/css">
    ${capsizedStyleRule}
  </style>
  <div class="capsizedText">
    My capsized text 🛶
  </div>
`);
```

## Options

### Text size

Capsize supports two methods of defining the size of text, `capHeight` and `fontSize`.

**NOTE: You should only ever pass one or the other, not both.**

#### `capHeight: <number>`

Sets the height of the capital letters to the defined value. Defining typography in this way makes aligning to a grid or with other elements, e.g. icons, a breeze.

<img src="https://raw.githubusercontent.com/seek-oss/capsize/HEAD/images/capheight.png" alt="Highlighting the cap height" title="Cap Height" width="220px" />

#### `fontSize: <number>`

Setting the font size allows you to get all the benefits of the white space trimming, while still specifying an explicit `font-size` for your text. This can be useful when needed to match a concrete design spec or fitting into an existing product.

<img src="https://raw.githubusercontent.com/seek-oss/capsize/HEAD/images/fontsize.png" alt="Highlighting the font size" title="Font Size" width="220px" />

### Line height

Capsize supports two mental models for specifying line height, `lineGap` and `leading`. If you pass neither the text will follow the default spacing of the specified font, e.g. `line-height: normal`.

**NOTE: You should only ever pass one or the other, not both.**

#### `lineGap: <number>`

Sets the number of pixels between lines, as measured between the baseline and cap height of the next line.

<img src="https://raw.githubusercontent.com/seek-oss/capsize/HEAD/images/linegap.png" alt="Highlighting the line gap" title="Line Gap" width="220px" />

#### `leading: <number>`

Sets the line height to the provided value as measured from the baseline of the text. This aligns the web with how typography is treated in design tools.

<img src="https://raw.githubusercontent.com/seek-oss/capsize/HEAD/images/leading.png" alt="Highlighting the leading" title="Leading" width="220px" />

### Font Metrics

This metadata is extracted from the metrics tables inside the font itself. There are a number of ways to find this information:

- If using a Google Font or system font, install the [@capsizecss/metrics](packages/metrics/README.md) package and import the metrics by name. For example:
  ```ts
  import arialMetrics from '@capsizecss/metrics/arial';
  ```
- If using a font from a file, install the [@capsizecss/unpack](packages/unpack/README.md) package and extract the metrics from the font file directly. For example:

  ```ts
  import { fromFile } from '@capsizecss/unpack';

  const metrics = await fromFile(filePath);
  ```

- Or, use [the Capsize website](https://seek-oss.github.io/capsize/) to find these by selecting a font and referencing `Metrics` tab in step 3.

## Core

The core package also provides access to lower level values for a specific font and font size combination.

### precomputeValues

Returns all the information required to create styles for a specific font size given the provided font metrics. This is useful for integrations with different styling solutions.

```ts
import { precomputeValues } from '@capsizecss/core';

const capsizeValues = precomputeValues({
  fontSize: 24,
  fontMetrics: {
    ...
  }
})

// => {
//  fontSize: string,
//  lineHeight: string,
//  capHeightTrim: string,
//  baselineTrim: string,
//}
```

### getCapHeight

Return the rendered cap height for a specific font size given the provided font metrics.

```ts
import { getCapHeight } from '@capsizecss/core';

const actualCapHeight = getCapHeight({
  fontSize: 24,
  fontMetrics: {
    ...
  }
})

// => number
```

## Metrics

To make the retrieval of font metrics easy, Capsize provides the `@capsizecss/metrics` package containing all the required data for both system and Google fonts.

```bash
npm install @capsizecss/metrics
```

See the [package](packages/metrics/README.md) for documentation.

## Unpack

If you are using a custom font or one not included in the `@capsizecss/metrics` package, Capsize provides the `@capsizecss/unpack` package to extract the required data either via a URL or from a local file.

```bash
npm install @capsizecss/unpack
```

See the [package](packages/unpack/README.md) for documentation.

## Integrations

- [vanilla-extract](https://vanilla-extract.style) integration via [@capsizecss/vanilla-extract](packages/vanilla-extract/README.md)

## Thanks

- [Vincent De Oliveira](https://twitter.com/iamvdo) for writing [Deep dive CSS: font metrics, line-height and vertical-align](https://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align), which provided the research needed to build all this.
- [Devon Govett](https://github.com/devongovett) for creating [Fontkit](https://github.com/foliojs/fontkit), which does all the heavy lifting of extracting the font metrics under the covers.
- [SEEK](https://www.seek.com.au) for giving us the space to do interesting work.

## License

MIT.
