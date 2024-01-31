import { defineConfig } from 'vite';
import inspect from 'vite-plugin-inspect';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import react from '@vitejs/plugin-react-swc';
import vike from 'vike/plugin';

export default defineConfig(async () => ({
  clearScreen: false,
  server: {
    port: 5173,
  },
  build: {
    // These settings only apply on `vite build`
    commonjsOptions: {
      include: [new RegExp('packages/metrics'), /node_modules/],
      exclude: [/react-helmet-async/],
      defaultIsModuleExports: true,
    },
    rollupOptions: {
      external: () => false,
    },
  },
  // esbuild: {
  //   jsxImportSource: '@emotion/react',
  // },
  ssr: {
    noExternal: ['react-helmet-async', 'react-syntax-highlighter'],
  },
  plugins: [
    viteCommonjs({
      include: [
        'packages/metrics',
        '@emotion/react',
        'hoist-non-react-statics',
        'react-helmet-async',
        'react-is',
      ],
    }),
    nodePolyfills({
      include: ['buffer'],
    }),
    react({
      jsxImportSource: '@emotion/react',
    }),
    vike({
      // For GitHub Pages, the base url is https://seek-oss.github.io/capsize
      baseAssets: process.env.IS_GITHUB_PAGES ? '/capsize' : undefined,
      prerender: true,
    }),
    (await import('vite-imagetools')).imagetools(),
    inspect(),
  ],
}));
