# @capsizecss/core

## 3.0.0
### Major Changes



- [#41](https://github.com/seek-oss/capsize/pull/41) [`beb400b`](https://github.com/seek-oss/capsize/commit/beb400beab5296353da32c4676466355184ab22b) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - The `capsize` package has been moved to its own organisation on npm called `@capsizecss`. This will allow an official ecosystem of tooling to be added over time.
  
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
  
  #### `precomputeValues`
  
  Accepts capsize `options` and returns all the information required to create styles for a specific font size given the provided font metrics. This is useful for integrations with different styling solutions.
  
  ### Breaking Change Migration Guide
  
  #### Installation
  
  Replace the previous `capsize` dependency with the new scoped version of the package `@capsizecss/core`:
  
  ```bash
  npm uninstall capsize
  npm install @capsizecss/core
  ```
  
  #### API changes
  
  There is no longer a default export, this behaviour is now available via the `createStyleObject` named export.
  
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
  
  #### Import changes
  
  Both the `getCapHeight` function and `FontMetrics` type still exist, but the package name will need to be updated.
  
  ```diff
  - import { getCapHeight, FontMetrics } from 'capsize';
  + import { getCapHeight, FontMetrics } from '@capsizecss/core';
  ```
  
  #### Removals
  
  The `CapsizeOptions` type has been removed, you can infer this from the first argument passed to `createStyleObject` using TypeScripts built-in `Parameters` utility:
  
  ```diff
  - import type { CapsizeStyles } from 'capsize';
  + import type { createStyleObject } from '@capsizecss/core';
  
  + type CapsizeOptions = Parameters<typeof createStyleObject>[0];
  ```
  
  The `CapsizeStyles` type has been removed, you can infer this from `createStyleObject` using TypeScripts built-in `ReturnType` utility:
  
  ```diff
  - import type { CapsizeStyles } from 'capsize';
  + import type { createStyleObject } from '@capsizecss/core';
  
  + type CapsizeStyles = ReturnType<typeof createStyleObject>;
  ```
