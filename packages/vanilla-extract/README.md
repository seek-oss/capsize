<img src="https://raw.githubusercontent.com/seek-oss/capsize/HEAD/images/capsize-header.png" alt="Capsize" title="Capsize" width="443px" />
<br/>
<br/>

<br/>

- [Usage](#usage)
  - [Themed typography](#themed-typography)
  - [Responsive typography](#responsive-typography)
  - [Debug identifiers](#debug-identifiers)

<br/>

```bash
npm install @capsizecss/vanilla-extract
```

## Usage

1. Import `createTextStyle` within your vanilla-extract stylesheet, passing the relevant [options](../../README.md#options).

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

2. Import that class from your stylesheet and apply to the text element

```ts
// Text.ts
import * as styles from './Text.css';

document.write(`
  <div class="${styles.text}">
    My capsized text 🛶
  </div>
`);
```

### Themed typography

When using a [vanilla-extract theme](https://vanilla-extract.style/documentation/styling-api/#createtheme) to manage your typography, you need to precompute and store the values at a theme level.

Import `precomputeValues` passing the relevant [options](../../README.md#options) and assign to your vanilla-extract theme. These precomputed values can then be directly passed to `createTextStyles` as below:

```ts
// Text.css.ts
import { createTheme } from '@vanilla-extract/css';
import { createTextStyle, precomputeValues } from '@capsizecss/vanilla-extract';

const vars = createTheme({
  bodyText: precomputeValues({
    fontSize: 18,
    leading: 24,
    fontMetrics: {
      capHeight: 700,
      ascent: 1058,
      descent: -291,
      lineGap: 0,
      unitsPerEm: 1000,
    },
  }),
});

export const text = createTextStyle(vars.bodyText);
```

### Responsive typography

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
import { createTheme } from '@vanilla-extract/css';
import { createTextStyle, precomputeValues } from '@capsizecss/vanilla-extract';

const fontMetrics = {
  capHeight: 700,
  ascent: 1058,
  descent: -291,
  lineGap: 0,
  unitsPerEm: 1000,
};

const vars = createTheme({
  bodyText: {
    mobile: precomputeValues({ fontSize: 18, leading: 24, fontMetrics }),
    tablet: precomputeValues({ fontSize: 16, leading: 22, fontMetrics }),
    desktop: precomputeValues({ fontSize: 14, leading: 18, fontMetrics }),
  },
});

export const text = createTextStyle(vars.bodyText.mobile, {
  '@media': {
    'screen and (min-width: 768px)': vars.bodyText.tablet,
    'screen and (min-width: 1024px)': vars.bodyText.desktop,
  },
});
```

### Debug identifiers

To improve the developer experience, `createTextStyle` accepts a debug identifier as the last argument.

```ts
export const text = createTextStyle({ ... }, 'myCapsizedRule');
```

This produces a class name something like `.Text_myCapsizedRule__1bese54h`

<br/>
<br />

# License

MIT.
