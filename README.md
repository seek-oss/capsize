<img src="https://raw.githubusercontent.com/seek-oss/capsize/HEAD/images/capsize-header.png" alt="Capsize" title="Capsize" width="443px" />
<br/>
<br/>

> Capsize makes the sizing and layout of text as predictable as every other element on the screen.
>
> Using font metadata, text can now be sized according to the height of its capital letters while trimming the space above capital letters and below the baseline.

<br/>

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
  - [Text size](#text-size)
  - [Line height](#line-height)
  - [Font Metrics](#font-metrics)
- [Integrations](#setup)
  - [vanilla-extract](#vanilla-extract)
- [Core](#core)
  - [buildCSSValues](#buildCSSValues)
  - [getCapHeight](#getCapHeight)

<br/>

## Installation

Install the core package:

```bash
npm install @capsizecss/core
```

## Usage

### `createStyleObject`

Returns a CSS in JS style object.

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

Return a CSS string that can be inserted into a `style` tag or appended to a stylesheet.

1. Import `createStyleString` passing the relevant [options](#options).

```ts
import { createStyleString } from '@capsizecss/core';

const capsizedStyleRule = createStyleString('capsizedText', {
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

<br/>

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

This metadata is extracted from the metrics tables inside the font itself. You can use [the Capsize website](https://seek-oss.github.io/capsize/) to find these by selecting a font and referencing `Metrics` tab in step 3.

<br />

## Integrations

### vanilla-extract

1. Install the [vanilla-extract](https://vanilla-extract.style) integration.

```bash
npm install @capsizecss/vanilla-extract
```

2. Import `createTextStyle` within your vanilla-extract stylesheet, passing the relevant [options](#options).

```ts
// Text.css.ts
import { createTextStyle } from '@capsizecss/vanilla-extract';

export const text = createTextStyle({
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

3. Import that class from your stylesheet and apply to the text element

```ts
// Text.ts
import * as styles from './Text.css.ts';

document.write(`
  <div class="${styles.text}">
    My capsized text 🛶
  </div>
`);
```

#### Themed typography

When using a [vanilla-extract theme](https://vanilla-extract.style/documentation/styling-api/#createtheme) to manage your typography, you need to precompute and store the values at a theme level.

1. Import `computeValues` passing the relevant [options](#options) and assign to your vanilla-extract theme.

```ts
// theme.css.ts
import { computeValues } from '@capsizecss/vanilla-extract';

const fontMetrics = {
  capHeight: 700,
  ascent: 1058,
  descent: -291,
  lineGap: 0,
  unitsPerEm: 1000,
};

export const vars = createTheme({
  typography: {
    standard: {
      mobile: computeValues({
        fontSize: 18,
        leading: 24,
        fontMetrics,
      }),
      tablet: computeValues({
        fontSize: 16,
        leading: 22,
        fontMetrics,
      }),
      desktop: computeValues({
        fontSize: 14,
        leading: 18,
        fontMetrics,
      }),
    },
  },
});
```

2. In your vanilla-extract stylesheet, import `createTextStyle`, passing in the values from the theme.

```ts
// Text.css.ts
import { createTextStyle } from '@capsizecss/vanilla-extract';
import { vars } from './theme.css.ts';

export const text = createTextStyle(vars.typography.standard.mobile);
```

This will return a class list that can then be applied to the text element as normal.

#### Responsive typography

As a convenience for responsive styles, `createTextStyle` accepts a second argument in the form of a vanilla-extract [media query object](https://vanilla-extract.style/documentation/styling-api/#style), returning the full responsive class list.

```ts
// Text.css.ts
import { createTextStyle } from '@capsizecss/vanilla-extract';

const fontMetrics = {
  capHeight: 700,
  ascent: 1058,
  descent: -291,
  lineGap: 0,
  unitsPerEm: 1000,
};
const textDefinitions = {
  mobile: { fontSize: 18, leading: 24, fontMetrics },
  tablet: { fontSize: 16, leading: 22, fontMetrics },
  desktop: { fontSize: 14, leading: 18, fontMetrics },
};

export const text = createTextStyle(textDefinitions.mobile, {
  '@media': {
    'screen and (min-width: 768px)': textDefinitions.tablet,
    'screen and (min-width: 1024px)': textDefinitions.desktop,
  },
});
```

Or in the themed case:

```ts
// Text.css.ts
import { createTextStyle } from '@capsizecss/vanilla-extract';
import { vars } from './theme.css.ts';

export const text = createTextStyle(vars.typography.standard.mobile, {
  '@media': {
    'screen and (min-width: 768px)': vars.typography.standard.tablet,
    'screen and (min-width: 1024px)': vars.typography.standard.desktop,
  },
});
```

#### Debug identifiers

To improve the developer experience, `createTextStyle` accepts a debug identifier as the last argument.

```ts
export const text = createTextStyle({ ... }, 'myCapsizedRule');
```

This produces a class name something like `.Text_myCapsizedRule__1bese54h`

<br/>

## Core

Access to lower level values for a specific font and font size is available via the `core` module.

```bash
npm install @capsizecss/core
```

### buildCSSValues

Returns all the information require to create styles for a specific font size given the provided font metrics. This is useful for integrations with different styling solutions.

```ts
import { buildCSSValues } from '@capsizecss/core';

const capsizeValues = buildCSSValues({
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

<br />
<br />

# License

MIT.
