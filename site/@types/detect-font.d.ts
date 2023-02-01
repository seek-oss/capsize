declare module 'detect-font' {
  interface Options {
    text?: string;
    fontSize?: number;
    baseFont?: string;
  }

  function detectFont(el: HTMLElement, opts?: Options): string | false;
}
