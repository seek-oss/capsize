---
'@capsizecss/core': major
---

Use logical instead of physical block margins

Capsize does not work on text, that is rotated 90deg (using [`writing-mode: vertical-lr;`](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode)).
The current implementation always applies `margin-top` and `margin-bottom`, regardless of the actual orientation.

This change replaces `margin-top` with `margin-block-start` and `margin-bottom` with `margin-block-end`, as these properties respect aforementioned text orientation.

From [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block#syntax):
> This property corresponds to the [margin-top](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top) and [margin-bottom](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom), or the [margin-right](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right) and [margin-left](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left) properties, depending on the values defined for [writing-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode), [direction](https://developer.mozilla.org/en-US/docs/Web/CSS/direction), and [text-orientation](https://developer.mozilla.org/en-US/docs/Web/CSS/text-orientation).
