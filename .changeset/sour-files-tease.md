---
'@capsizecss/vanilla-extract': major
---

Drop support for Vanilla Extract below v1.4

Upgrading to use Vanilla Extract's [style composition] API in favour of the long time deprecated `composeStyles` function.
There is no API change for Capsize consumers, but this change will require a peer dependency of `vanilla-extract@1.4.0` or greater.

[style composition]: https://vanilla-extract.style/documentation/api/style/#style-composition