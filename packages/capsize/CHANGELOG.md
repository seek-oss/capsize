# capsize

## 2.0.0

### Major Changes

- [`4719217`](https://github.com/seek-oss/capsize/commit/47192178585a61694ec9e25af53f67b9fc7d1df1) [#33](https://github.com/seek-oss/capsize/pull/33) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - **Change margin collapse guard from padding to display table**

  The styles object returned from `capsize` no longer contains a `padding` property (also removed the `height` property from the pseudo elements). This was previously used to prevent the negative margins from collapsing.

  The technique has been swapped out in favour of using `display: table` on the pseudo elements, which also required an inversion of the negative margin direction.

  ```diff
  {
    "fontSize": "67.5165px",
    "lineHeight": "72px",
  -  "padding": "0.05px 0",
    "::before": {
      "content": "''",
  +    "marginBottom": "-0.1648em",
  +    "display": "table",
  -    "marginTop": "-0.1648em",
  -    "display": "block",
  -    "height": 0
    },
    "::after": {
      "content": "''",
  +    "marginTop": "-0.1921em",
  +    "display": "table",
  -    "marginBottom": "-0.1921em",
  -    "display": "block",
  -    "height": 0
    }
  }
  ```

### Patch Changes

- [`4719217`](https://github.com/seek-oss/capsize/commit/47192178585a61694ec9e25af53f67b9fc7d1df1) [#33](https://github.com/seek-oss/capsize/pull/33) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Internalise rounding function to remove dependencies

## 1.1.0

### Minor Changes

- [`943bbc4`](https://github.com/seek-oss/capsize/commit/943bbc437406ea7448ed86f441a64a5ec584c212) [#19](https://github.com/seek-oss/capsize/pull/19) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Add getCapHeight utility and round decimal precision to 4 places

  **Add `getCapHeight({ fontSize: number, fontMetrics: FontMetrics }): number`**
  Utility to get the actual rendered cap height for a specific font size given the provided font metrics.

  **CSS property precision**
  Based on discovering that browser implementations of layout units fall between 1/60th and 1/64th of a pixel, rounding all property values to 4 decimal precision.

  Reference: https://trac.webkit.org/wiki/LayoutUnit
  (also mentions Mozilla - https://trac.webkit.org/wiki/LayoutUnit#Notes)

## 1.0.1

### Patch Changes

- [`9508c63`](https://github.com/seek-oss/capsize/commit/9508c63fc778f0f3122f7ab1f95af925c07b0811) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Update dependencies & npm keywords

## 1.0.0

### Major Changes

- [`0589488`](https://github.com/seek-oss/capsize/commit/0589488690355e2c502f1534ccb50e46848eb0bd) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Initial release
