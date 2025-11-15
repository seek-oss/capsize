// Vike config https://vike.dev/migration/settings
export default {
  // For GitHub Pages, the base url is https://seek-oss.github.io/capsize
  baseAssets: process.env.IS_GITHUB_PAGES ? '/capsize' : undefined,
  prerender: true,
};
