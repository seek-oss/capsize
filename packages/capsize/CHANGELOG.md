# capsize

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
