---
'@capsizecss/core': major
---

Use logical instead of physical block margins

Support different [writing-modes], e.g.`writing-mode: vertical-lr;` by adopting logical block margins in favour of the explicit physical margins.

### BREAKING CHANGE:

#### Browser support

The switch to logical block margins means that browsers from before 2019 will likely not understand the property resulting in no trim. We think it's a valid trade off at this time, get in touch if you disagree.

See [caniuse] for more details on when the different browsers added support.

#### API Change

TL;DR If you are using the object returned from `createStyleObject` as a passthrough without interrogating it's properties, there is no API break!

Given the change to the CSS properties of the pseudo elements (i.e. `marginTop` to `marginBlockStart` and `marginBottom` to `marginBlockEnd`), any consumer of `createStyleObject` that is interrogating the style object may need to update their usage:

```diff
import { createStyleObject } from '@capsizecss/core';

const capsizeStyles = createStyleObject(...);

// Any access to the CSS properties on the return pseudo elements should be updated
- capsizeStyles.['::before'].marginBottom
+ capsizeStyles.['::before'].marginBlockEnd

- capsizeStyles.['::after'].marginTop
+ capsizeStyles.['::after'].marginBlockStart
```

See [margin-block-start] and [margin-block-end] documentation on MDN for more details.

[caniuse]: https://caniuse.com/mdn-css_properties_margin-block-end
[margin-block-start]: https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-start
[margin-block-end]: https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-end
[writing-modes]: https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode
