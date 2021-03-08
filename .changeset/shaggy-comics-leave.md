---
'capsize': major
---

**Change margin collapse guard from padding to display table**

The styles object returned from `capsize` no longer contains a `padding` property (also removed the `height` property from the psuedo elements). This was previously used to prevent the negative margins from collapsing.

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