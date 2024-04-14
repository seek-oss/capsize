---
'@capsizecss/metrics': minor
'@capsizecss/unpack': minor
---

Extract and expose `postscriptName` and `fullName` from font metrics

The font metrics returned now include the `postscriptName` and `fullName` properties as authored by the font creator.

For example:
```ts
// Arial Regular metrics
{
  "familyName": "Arial",
  "fullName": "Arial",
  "postscriptName": "ArialMT",
  ...
}

// Arial Bold metrics
{
  "familyName": "Arial",
  "fullName": "Arial Bold",
  "postscriptName": "Arial-BoldMT",
  ...
}
```

These values are particularly useful when constructing CSS `@font-face` declarations, as they can be used to specify [local(<font-face-name>)] sources.
MDN recommends using both “to assure proper matching across platforms”.

```css
@font-face {
  font-family: "Web Font Fallback";
  src: local('Arial Bold'), local('Arial-BoldMT');
  font-weight: 700;
  ascent-override: 89.3502%;
  descent-override: 23.1683%;
  size-adjust: 108.3377%;
}
```

[local(<font-face-name>)]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src#localfont-face-name