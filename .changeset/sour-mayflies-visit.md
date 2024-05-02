---
'@capsizecss/core': patch
---

createFontStack: Ensure provided \`size-adjust\` is factored into metric overrides

Ensures a custom `size-adjust` value provided via the `fontFaceProperties` option is factored into the calculations for the metric overrides.

#### Example

If a custom `size-adjust` value is provided:

```ts
createFontStack(
  [ merriweatherSans, arial ],
  {
    fontFaceProperties: {
      sizeAdjust: '300%'
    }
  },
)
```

The resulting metric overrides are now adjusted accordingly:

```diff
 @font-face {
   font-family: "Merriweather Sans Fallback";
   src: local('Arial');
-  ascent-override: 92.3409%;
+  ascent-override: 32.8%;
-  descent-override: 25.619%;
+  descent-override: 9.1%;
   line-gap-override: 0%;
   size-adjust: 300%;
 }
```