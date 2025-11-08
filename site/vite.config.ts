import { defineConfig } from 'vite';
import inspect from 'vite-plugin-inspect';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import react from '@vitejs/plugin-react-swc';
import vike from 'vike/plugin';
import { imagetools } from 'vite-imagetools';

export default defineConfig(() => ({
  clearScreen: false,
  server: {
    port: 5173,
  },
  resolve: {
    conditions: ['@capsizecss/src'],
  },
  build: {
    // These settings only apply on `vite build`
    commonjsOptions: {
      include: [/node_modules/],
      exclude: [/react-helmet-async/],
      defaultIsModuleExports: true,
    },
    rollupOptions: {
      external: () => false,
    },
  },
  ssr: {
    noExternal: ['react-helmet-async', 'react-syntax-highlighter'],
  },
  plugins: [
    viteCommonjs({
      include: [
        '@emotion/react',
        'hoist-non-react-statics',
        'react-helmet-async',
        'react-is',
      ],
    }),
    nodePolyfills({
      include: ['buffer'],
    }),
    react(),
    vike({
      // For GitHub Pages, the base url is https://seek-oss.github.io/capsize
      baseAssets: process.env.IS_GITHUB_PAGES ? '/capsize' : undefined,
      prerender: true,
    }),
    imagetools(),
    inspect(),
  ],
}));
