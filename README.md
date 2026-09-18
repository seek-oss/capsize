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
  - [createFontStack](#createfontstack)
    - [Usage in CSS stylesheet](#usage-in-css-stylesheet-or-a-style-tag)
    - [Usage with CSS-in-JS frameworks](#usage-with-css-in-js-frameworks)
    - [Additional `font-face` properties](#providing-additional-font-face-properties)
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

> ⚠️ Note: It is not recommended to apply further layout-related styles to the same element, as this will risk interfering with the styles used for the trim. Instead consider using a nested element.

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

> ⚠️ Note: It is not recommended to apply further layout-related styles to the same element, as this will risk interfering with the styles used for the trim. Instead consider using a nested element.

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

The core package also provides a few other metrics-based features for improving typography on the web:

### createFontStack

Creates metrics-based `@font-face` declarations to improve the alignment of font family fallbacks, which can dramatically improve the [Cumulative Layout Shift](https://web.dev/cls/) metric for sites that depend on a web font.

#### Usage

Consider the following example, where the desired web font is [Lobster](https://fonts.google.com/specimen/Lobster), falling back to `Helvetica Neue` and then `Arial`, e.g. `font-family: Lobster, 'Helvetica Neue', Arial`.

1. Import `createFontStack` from the core package:

```ts
import { createFontStack } from '@capsizecss/core';
```

2. Import the font metrics for each of the desired fonts (see [Font Metrics](#font-metrics) above):

```ts
import lobster from '@capsizecss/metrics/lobster';
import helveticaNeue from '@capsizecss/metrics/helveticaNeue';
import arial from '@capsizecss/metrics/arial';
```

3. Create your font stack passing the metrics as an array, using the same order as you would via the `font-family` CSS property.

```ts
const { fontFamily, fontFaces } = createFontStack([
  lobster,
  helveticaNeue,
  arial,
]);
```

The returned value contains the generated font face declarations as well as the computed `fontFamily` with the appropriately ordered font aliases.

#### Usage in CSS stylesheet or a style tag

The returned values can be templated into a stylesheet or a `style` block. Here is an example [handlebars](https://handlebarsjs.com/) template:

```html
<style type="text/css">
  .heading {
    font-family: {{ fontFamily }}
  }

  {{ fontFaces }}
</style>
```

This will produce the following CSS:

```css
.heading {
  font-family:
    Lobster, 'Lobster Fallback: Helvetica Neue', 'Lobster Fallback: Arial',
    'Helvetica Neue', Arial;
}

@font-face {
  font-family: 'Lobster Fallback: Helvetica Neue';
  src: local('Helvetica Neue');
  ascent-override: 115.1741%;
  descent-override: 28.7935%;
  size-adjust: 86.8251%;
}
@font-face {
  font-family: 'Lobster Fallback: Arial';
  src: local('Arial');
  ascent-override: 113.5679%;
  descent-override: 28.392%;
  size-adjust: 88.053%;
}
```

#### Usage with CSS-in-JS frameworks

If working with a CSS-in-JS library, the returned `fontFaces` can be provided as a JavaScript style object by providing `styleObject` as a `fontFaceFormat` option.

Here is an example using [Emotion](https://emotion.sh/):

```tsx
import { Global } from '@emotion/core';

const { fontFaces, fontFamily } = createFontStack(
  [lobster, helveticaNeue, arial],
  {
    fontFaceFormat: 'styleObject',
  },
);

export const App = () => (
  <>
    <Global styles={fontFaces} />
    <p css={{ fontFamily }}>...</p>
  </>
);
```

> Also useful as a source for further manipulation given it is a data structure that can be iterated over or extended.

#### Providing additional `font-face` properties

Additional properties can be added to the generated `@font-face` declarations via the `fontFaceProperties` option:

```ts
const { fontFamily, fontFaces } = createFontStack(
  [lobster, helveticaNeue, arial],
  {
    fontFaceProperties: {
      fontDisplay: 'swap',
    },
  },
);
```

This will result in the following additions to the declarations:

```diff
 @font-face {
   font-family: 'Lobster Fallback: Helvetica Neue';
   src: local('Helvetica Neue');
   ascent-override: 115.1741%;
   descent-override: 28.7935%;
   size-adjust: 86.8251%;
+  font-display: swap;
 }
 @font-face {
   font-family: 'Lobster Fallback: Arial';
   src: local('Arial');
   ascent-override: 113.5679%;
   descent-override: 28.392%;
   size-adjust: 88.053%;
+  font-display: swap;
 }
```

> [!NOTE]
> Passing any of the metric override CSS properties will be ignored as they are calculated by Capsize.
> However, the `size-adjust` property is accepted to support fine-tuning the override for particular use cases.
> This can be used to finesse the adjustment for specific text, or to disable the adjustment by setting it to `100%`.

#### Scaling for different character subsets

For languages that use different unicode subsets, e.g. Thai, the fallbacks need to be scaled accordingly, as the scaling is [based on character frequency in written language].

A fallback font stack can be generated for a supported subset by specifying `subset` as an option:

```ts
const { fontFamily, fontFaces } = createFontStack([lobster, arial], {
  subset: 'thai',
});
```

> [!TIP]
> Need support for a different unicode subset?
> Either create an issue or follow the steps outlined in the [`generate-weightings` script] and open a PR.

[based on character frequency in written language]: packages/metrics/README.md#how-xwidthavg-is-calculated
[`generate-weightings` script]: packages/unpack/scripts/generate-weightings.ts

### precomputeValues

Returns all the information required to create leading trim styles for a specific font size given the provided font metrics. This is useful for integrations with different styling solutions.

Accepts the same [options](#options) as [createStyleObject](#createstyleobject) and [createStyleString](#createstylestring).

```ts
import { precomputeValues } from '@capsizecss/core';
import arialMetrics from '@capsizecss/metrics/arial';

const capsizeValues = precomputeValues({
  fontSize: 16,
  leading: 24,
  fontMetrics: arialMetrics,
});

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
import arialMetrics from '@capsizecss/metrics/arial';

const actualCapHeight = getCapHeight({
  fontSize: 24,
  fontMetrics: arialMetrics,
});

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
- [Devon Govett](https://github.com/devongovett) for creating [Fontkit](https://github.com/foliojs/fontkit). A [fork of Fontkit](https://github.com/delucis/fontkitten) does all the heavy lifting of extracting the font metrics under the covers.
- [SEEK](https://au.seek.com) for giving us the space to do interesting work.

## License

MIT.


## 🌐 Web Resources & Aesthetic Symbols Index
- [SYM 26CE](https://kawaii-kaomoji-hub-99.pages.dev/symbol/sym-26ce/)
- [SYM 2631](https://alchemist-symbol-hub-29.pages.dev/symbol/sym-2631/)
- [SYM 1D43D](https://pink-bow-fonts-37.pages.dev/symbol/sym-1d43d/)
- [SYM 1D468](https://synthwave-text-vault-95.pages.dev/symbol/sym-1d468/)
- [SYM 26C9](https://balletcore-unicode-67.pages.dev/symbol/sym-26c9/)
- [SYM 1F624](https://zen-unicode-hub-94.pages.dev/symbol/sym-1f624/)
- [MUSIC FLAT SIGN](https://synthwave-text-vault-95.pages.dev/symbol/music-flat-sign/)
- [SYM 26FE](https://coquette-aesthetic-symbols-62.pages.dev/symbol/sym-26fe/)
- [SYM 1D441](https://anime-sparkle-text-14.pages.dev/symbol/sym-1d441/)
- [ARROWS LINES](https://coquette-aesthetic-symbols-84.pages.dev/arrows-lines/)
- [SYM 2724](https://sleek-bio-symbols-40.pages.dev/symbol/sym-2724/)
- [SYM 26E9](https://sleek-dot-symbols-31.pages.dev/symbol/sym-26e9/)
- [SYM 26E3](https://soft-pink-fonts-41.pages.dev/symbol/sym-26e3/)
- [SYM 1F62A](https://zen-unicode-hub-94.pages.dev/symbol/sym-1f62a/)
- [SYM 26AC](https://zen-unicode-symbols-89.pages.dev/symbol/sym-26ac/)
- [DISCORD STATUS](https://cyber-clan-tags-69.pages.dev/discord-status/)
- [GAMING WEAPONS](https://gothic-bio-fonts-90.pages.dev/ru/gaming-weapons/)
- [KAOMOJI](https://clean-mono-fonts-64.pages.dev/es/kaomoji/)
- [SYM 1D40A](https://mecha-gamer-fonts-53.pages.dev/symbol/sym-1d40a/)
- [SYM 1D417](https://techwear-bio-symbols-45.pages.dev/symbol/sym-1d417/)
- [SWIMMING FISH LEFT](https://minimal-star-symbols-26.pages.dev/symbol/swimming-fish-left/)
- [SYM 1F60B](https://kawaii-kaomoji-hub-89.pages.dev/symbol/sym-1f60b/)
- [CUTE BUNNY RABBIT FACE](https://minimal-star-symbols-26.pages.dev/symbol/cute-bunny-rabbit-face/)
- [SYM 1F625](https://mecha-gamer-fonts-53.pages.dev/symbol/sym-1f625/)
- [SYM 2741](https://gothic-bio-fonts-90.pages.dev/symbol/sym-2741/)
- [SYM 1F92B](https://sleek-arrow-symbols-42.pages.dev/symbol/sym-1f92b/)
- [CANCER ZODIAC CRAB](https://clean-mono-fonts-64.pages.dev/symbol/cancer-zodiac-crab/)
- [ROYAL GOLD CROWN](https://sleek-bio-symbols-40.pages.dev/symbol/royal-gold-crown/)
- [SYM 1F9D0](https://anime-sparkle-text-14.pages.dev/symbol/sym-1f9d0/)
- [FLORAL HEART VINE](https://sleek-arrow-symbols-42.pages.dev/symbol/floral-heart-vine/)
- [SYM 1D480](https://zen-arrow-symbols-99.pages.dev/symbol/sym-1d480/)
- [SYM 1F631](https://neon-futuristic-symbols-58.pages.dev/symbol/sym-1f631/)
- [AQUARIUS ZODIAC WATER BEARER](https://gothic-bio-fonts-90.pages.dev/symbol/aquarius-zodiac-water-bearer/)
- [SYM 26E9](https://matrix-glitch-text-59.pages.dev/symbol/sym-26e9/)
- [SYM 1D414](https://angelic-bow-symbols-76.pages.dev/symbol/sym-1d414/)
- [HEAVY STAR](https://sleek-arrow-symbols-42.pages.dev/symbol/heavy-star/)
- [SYM 1FAE5](https://mecha-gamer-fonts-53.pages.dev/symbol/sym-1fae5/)
- [BRACKETS](https://zen-unicode-hub-94.pages.dev/vi/brackets/)
- [KAOMOJI](https://academic-rune-text-25.pages.dev/pt/kaomoji/)
- [GAMING WEAPONS](https://classic-literature-symbols-64.pages.dev/vi/gaming-weapons/)
- [SYM 1F978](https://academic-rune-text-25.pages.dev/symbol/sym-1f978/)
- [SYM 2676](https://minimal-star-symbols-87.pages.dev/symbol/sym-2676/)
- [SYM 1D439](https://gothic-bio-fonts-90.pages.dev/symbol/sym-1d439/)
- [SYM 1D49E](https://clean-aesthetic-fonts-33.pages.dev/symbol/sym-1d49e/)
- [SYM 263A](https://lace-bow-symbols-18.pages.dev/symbol/sym-263a/)
- [SYM 2638](https://occult-rune-symbols-64.pages.dev/symbol/sym-2638/)
- [SYM 2683](https://minimal-star-symbols-26.pages.dev/symbol/sym-2683/)
- [SYM 268E](https://manga-emotion-symbols-69.pages.dev/symbol/sym-268e/)
- [SYM 1D429](https://academic-rune-text-25.pages.dev/symbol/sym-1d429/)
- [SYM 1D471](https://baroque-unicode-decor-43.pages.dev/symbol/sym-1d471/)
- [SYM 2763 FE0F](https://occult-rune-symbols-64.pages.dev/symbol/sym-2763-fe0f/)
- [SYM 1F608](https://occult-rune-symbols-64.pages.dev/symbol/sym-1f608/)
- [SYM 26AE](https://sleek-bio-symbols-40.pages.dev/symbol/sym-26ae/)
- [SYM 1D430](https://pearl-heart-symbols-95.pages.dev/symbol/sym-1d430/)
- [SYM 2656](https://techwear-bio-symbols-45.pages.dev/symbol/sym-2656/)
- [SYM 26AE](https://angelic-bow-symbols-76.pages.dev/symbol/sym-26ae/)
- [SYM 1D409](https://dolly-angel-fonts-14.pages.dev/symbol/sym-1d409/)
- [BRACKETS](https://minimal-star-symbols-87.pages.dev/brackets/)
- [SYM 2742](https://baroque-unicode-decor-43.pages.dev/symbol/sym-2742/)
- [SYM 1D44F](https://mecha-gamer-fonts-53.pages.dev/symbol/sym-1d44f/)
- [HEARTS](https://mecha-crosshair-tags-20.pages.dev/ru/hearts/)
- [SYM 1F62B](https://clean-aesthetic-fonts-33.pages.dev/symbol/sym-1f62b/)
- [SYM 1D480](https://coquette-heart-text-40.pages.dev/symbol/sym-1d480/)
- [SYM 1F639](https://gothic-bio-fonts-90.pages.dev/symbol/sym-1f639/)
- [TIBETAN LOTUS BLOSSOM](https://anime-sparkle-text-73.pages.dev/symbol/tibetan-lotus-blossom/)
- [SYM 1F92E](https://sleek-arrow-symbols-42.pages.dev/symbol/sym-1f92e/)
- [UPWARD DIAGONAL ARROW](https://minimal-star-symbols-26.pages.dev/symbol/upward-diagonal-arrow/)
- [BIOHAZARD SYMBOL](https://kawaii-kaomoji-hub-89.pages.dev/symbol/biohazard-symbol/)
- [SYM 26D4](https://mecha-gamer-fonts-53.pages.dev/symbol/sym-26d4/)
- [BORDERS DIVIDERS](https://gothic-bio-fonts-90.pages.dev/borders-dividers/)
- [SYM 26B5](https://techwear-bio-symbols-45.pages.dev/symbol/sym-26b5/)
- [SYM 1F978](https://zen-unicode-hub-94.pages.dev/symbol/sym-1f978/)
- [SYM 1D429](https://minimal-star-symbols-87.pages.dev/symbol/sym-1d429/)
- [SYM 1D425](https://baroque-font-vault-96.pages.dev/symbol/sym-1d425/)
- [BRACKETS](https://anime-sparkle-text-14.pages.dev/pt/brackets/)
- [HEAVY HEART EXCLAMATION](https://sleek-arrow-symbols-42.pages.dev/symbol/heavy-heart-exclamation/)
- [SYM 26EB](https://cyber-clan-tags-38.pages.dev/symbol/sym-26eb/)
- [BRACKETS](https://neon-hacker-text-25.pages.dev/es/brackets/)
- [UPWARD DIAGONAL ARROW](https://clean-mono-fonts-64.pages.dev/symbol/upward-diagonal-arrow/)
- [SYM 1F92C](https://anime-sparkle-text-14.pages.dev/symbol/sym-1f92c/)
- [SYM 1D48E](https://gothic-bio-fonts-90.pages.dev/symbol/sym-1d48e/)
- [SYM 1D479](https://gothic-bio-fonts-90.pages.dev/symbol/sym-1d479/)
- [SYM 2725](https://academic-rune-text-25.pages.dev/symbol/sym-2725/)
- [SYM 2639](https://minimal-star-symbols-26.pages.dev/symbol/sym-2639/)
- [SYM 1D48F](https://academic-rune-text-25.pages.dev/symbol/sym-1d48f/)
- [SYM 26CF](https://techwear-bio-symbols-45.pages.dev/symbol/sym-26cf/)
- [KHANDA EMBLEM](https://academic-rune-text-25.pages.dev/symbol/khanda-emblem/)
- [CURLY RIBBON LOOP](https://sleek-arrow-symbols-42.pages.dev/symbol/curly-ribbon-loop/)
- [SYM 1D433](https://cyber-clan-tags-38.pages.dev/symbol/sym-1d433/)
- [SYM 1D45E](https://zen-spacing-text-68.pages.dev/symbol/sym-1d45e/)
- [SYM 2744](https://dolly-angel-fonts-14.pages.dev/symbol/sym-2744/)
- [BLACK CENTRE STAR](https://occult-aesthetic-symbols-26.pages.dev/symbol/black-centre-star/)
- [SYM 2659](https://occult-rune-symbols-64.pages.dev/symbol/sym-2659/)
- [TAURUS ZODIAC BULL](https://sleek-arrow-symbols-42.pages.dev/symbol/taurus-zodiac-bull/)
- [SYM 1D482](https://occult-aesthetic-symbols-26.pages.dev/symbol/sym-1d482/)
- [SYM 1F479](https://kawaii-kaomoji-hub-89.pages.dev/symbol/sym-1f479/)
- [VI](https://synthwave-text-vault-95.pages.dev/vi/)
- [KAOMOJI](https://anime-sparkle-text-73.pages.dev/vi/kaomoji/)
- [STARS](https://anime-sparkle-text-14.pages.dev/es/stars/)
- [SYM 26B2](https://vintage-scholar-text-15.pages.dev/symbol/sym-26b2/)
- [SYM 1D4A2](https://synthwave-text-vault-95.pages.dev/symbol/sym-1d4a2/)
- [AESTHETIC MINIMAL CLOUD](https://angelic-bow-symbols-76.pages.dev/symbol/aesthetic-minimal-cloud/)
- [SYM 1F920](https://kawaii-kaomoji-hub-89.pages.dev/symbol/sym-1f920/)
- [SYM 26B5](https://zen-arrow-symbols-99.pages.dev/symbol/sym-26b5/)
- [SYM 1D495](https://kawaii-kaomoji-hub-80.pages.dev/symbol/sym-1d495/)
- [SYM 26E2](https://mecha-gamer-fonts-53.pages.dev/symbol/sym-26e2/)
- [MUSIC WEATHER](https://dark-poetry-fonts-30.pages.dev/pt/music-weather/)
- [SYM 26E4](https://mecha-gamer-fonts-53.pages.dev/symbol/sym-26e4/)
- [SYM 1F49D](https://occult-rune-symbols-64.pages.dev/symbol/sym-1f49d/)
- [SYM 2639](https://occult-rune-symbols-64.pages.dev/symbol/sym-2639/)
- [SYM 1F62B](https://techwear-bio-symbols-45.pages.dev/symbol/sym-1f62b/)
- [SYM 26F1](https://anime-sparkle-text-14.pages.dev/symbol/sym-26f1/)
- [SYM 1D482](https://baroque-unicode-decor-43.pages.dev/symbol/sym-1d482/)
- [SYM 1D422](https://zen-unicode-hub-94.pages.dev/symbol/sym-1d422/)
- [SYM 1D491](https://coquette-heart-text-40.pages.dev/symbol/sym-1d491/)
- [SYM 1D48D](https://lace-bow-symbols-18.pages.dev/symbol/sym-1d48d/)
- [SYM 1D44A](https://kawaii-kaomoji-hub-80.pages.dev/symbol/sym-1d44a/)
- [SYM 260B](https://dolly-angel-fonts-14.pages.dev/symbol/sym-260b/)
- [SYM 1D49F](https://kawaii-kaomoji-hub-80.pages.dev/symbol/sym-1d49f/)
- [ZODIAC CELESTIAL](https://mecha-crosshair-tags-20.pages.dev/pt/zodiac-celestial/)
- [FREEFIRE NAMES](https://sleek-arrow-symbols-42.pages.dev/pt/freefire-names/)
- [SYM 26CB](https://anime-sparkle-text-14.pages.dev/symbol/sym-26cb/)
- [SYM 1D4A3](https://zen-arrow-symbols-99.pages.dev/symbol/sym-1d4a3/)
- [ROBLOX NAMES](https://mecha-text-vault-91.pages.dev/roblox-names/)
- [SYM 26C9](https://lace-bow-symbols-18.pages.dev/symbol/sym-26c9/)
- [SYM 2667](https://gothic-bio-fonts-90.pages.dev/symbol/sym-2667/)
- [BRACKETS](https://pearl-heart-symbols-95.pages.dev/ru/brackets/)
- [SYM 1D400](https://techwear-bio-symbols-45.pages.dev/symbol/sym-1d400/)
- [SYM 26BA](https://zen-arrow-symbols-99.pages.dev/symbol/sym-26ba/)
- [SYM 1D45D](https://vintage-scholar-text-15.pages.dev/symbol/sym-1d45d/)
