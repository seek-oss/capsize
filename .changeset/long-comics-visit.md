---
'@capsizecss/core': major
---

The `capsize` package has been moved to its own organisation on NPM called `@capsizecss`. This will allow an official ecosystem of tooling to be added over time.

### Features

#### `createStyleObject`

Accepts capsize `options` and returns a JS object representation of the capsize styles that is compatible with most css-in-js frameworks.

This replaces the default export of the previous version (see migration guide below).

```ts
import { createStyleObject } from '@capsizecss/core';

const capsizeStyles = createStyleObject({
  fontSize: 18,
  fontMetrics: {
    // ...
  }
});

<div
  css={{
    // fontFamily: '...' etc,
    ...capsizeStyles,
  }}
>
  My capsized text 🛶
</div>
```

#### `createStyleString`

Accepts capsize `options` and returns a string representation of the capsize styles that can then be templated into a HTML `style` tag or appended to a stylesheet.

```ts
import { createStyleString } from '@capsizecss/core';

const capsizedStyleRule = createStyleString('capsizedText', {
  fontSize: 18,
  fontMetrics: {
    // ...
  }
});

document.write(`
  <style type="text/css">
    ${capsizedStyleRule}
  </style>
  <div class="capsizedText">
    My capsized text 🛶
  </div>
`);
```

#### `buildCSSValues`



### Breaking Change Migration Guide

#### Installation

Replace the previous `capsize` dependency with the new scoped version of the package `@capsizecss/core`:

```bash
npm uninstall capsize
npm install @capsizecss/core
```

#### Usage

There is no longer a default export, this behaviour is now via the `createStyleObject` named export.

```diff
- import capsize from 'capsize';
+ import { createStyleObject } from '@capsizecss/core';

- const styles = capsize({
+ const styles = createStyleObject({
  fontSize: 18,
  fontMetrics: {
    // ...
  }
});
```

The `getCapHeight` still exists, but the package name will obviously need to be updated.

```diff
- import { getCapHeight } from 'capsize';
+ import { getCapHeight } from '@capsizecss/core';

const capHeight = getCapHeight({
  fontSize: 18,
  fontMetrics: {
    // ...
  }
});
```

In terms of type definitions, the core package exposes two types: `CapsizeOptions` and `CapsizeCSSValues`.

If you were previously using `FontMetrics`, you can find this as part of the `CapsizeOptions` interface:

```diff
- import type { FontMetrics } from 'capsize';
+ import type { CapsizeOptions } from '@capsizecss/core';

+ type FontMetrics = CapsizeOptions['fontMetrics'];
```

If you were previously using `CapsizeStyles`, you can infer this from the `ReturnType` of `createStyleObject`:

```diff
- import type { CapsizeStyles } from 'capsize';
+ import type { createStyleObject } from '@capsizecss/core';

+ type CapsizeStyles = ReturnType<typeof createStyleObject>;
```
