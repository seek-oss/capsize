/*
   Rounding all values to a precision of `4` based on discovering that browser
   implementations of layout units fall between 1/60th and 1/64th of a pixel.

   Reference: https://trac.webkit.org/wiki/LayoutUnit
   (above wiki also mentions Mozilla - https://trac.webkit.org/wiki/LayoutUnit#Notes)
*/
export const round = (value: number) => parseFloat(value.toFixed(4));
