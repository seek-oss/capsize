[![npm](https://img.shields.io/npm/v/capsize.svg?style=for-the-badge)](https://www.npmjs.com/package/capsize)

<br/>

<img src="https://raw.githubusercontent.com/seek-oss/capsize/HEAD/packages/capsize/images/capsize-header.png" alt="Capsize" title="Capsize" width="443px" />
<br/>

> Capsize makes the sizing and layout of text as predictable as every other element on the screen.
>
> Using font metadata, text can now be sized according to the height of its capital letters while trimming the space above capital letters and below the baseline.

<br/>
<br/>

```bash
$ npm i --save capsize
```

```js
import capsize from 'capsize';

const styles = capsize({
  capHeight: 16,
  lineGap: 8,
  fontMetrics: {
    capHeight: 700,
    ascent: 1058,
    descent: -291,
    lineGap: 0,
    unitsPerEm: 1000,
  },
});
```

<br/>

# Options

## Text size

Capsize supports two methods of defining the size of text, `capHeight` and `fontSize`.

**NOTE: You should only ever pass one or the other, not both.**

### `capHeight: <number>`

Sets the height of the capital letters to the defined value. Defining typography in this way makes aligning to a grid or with other elements, e.g. icons, a breeze.

<img src="https://raw.githubusercontent.com/seek-oss/capsize/HEAD/packages/capsize/images/capheight.png" alt="Highlighting the cap height" title="Cap Height" width="220px" />

### `fontSize: <number>`

Setting the font size allows you to get all the benefits of the white space trimming, while still specifying an explicit `font-size` for your text. This can be useful when needed to match a concrete design spec or fitting into an existing product.

<img src="https://raw.githubusercontent.com/seek-oss/capsize/HEAD/packages/capsize/images/fontsize.png" alt="Highlighting the font size" title="Font Size" width="220px" />

## Line height

Capsize supports two mental models for specifying line height, `lineGap` and `leading`. If you pass neither the text will follow the default spacing of the specified font, e.g. `line-height: normal`.

**NOTE: You should only ever pass one or the other, not both.**

### `lineGap: <number>`

Sets the number of pixels between lines, as measured between the baseline and cap height of the next line.

<img src="https://raw.githubusercontent.com/seek-oss/capsize/HEAD/packages/capsize/images/linegap.png" alt="Highlighting the line gap" title="Line Gap" width="220px" />

### `leading: <number>`

Sets the line height to the provided value as measured from the baseline of the text. This aligns the web with how typography is treated in design tools.

<img src="https://raw.githubusercontent.com/seek-oss/capsize/HEAD/packages/capsize/images/leading.png" alt="Highlighting the leading" title="Leading" width="220px" />

## Font Metrics

This metadata is extracted from the metrics tables inside the font itself. You can use [the Capsize website](https://seek-oss.github.io/capsize/) to find these by selecting a font and referencing `JavaScript` tab in step 3.

<br />

# Utilities

### getCapHeight

Returns the actual rendered cap height for a specific font size given the provided font metrics.

```ts
import { getCapHeight } from 'capsize';

const actualCapHeight = getCapHeight({
  fontSize: 24,
  fontMetrics: {
    ...
  }
})
```

<br />
<br />

# License

MIT.
