export function fontTypeFromUrl(url: string) {
  const m = url.match(/\.([0-9a-z]+)$/i);

  if (!m || m.length < 2) {
    throw new Error(`Can't determine font type from ${url}`);
  }

  return m[1];
}
