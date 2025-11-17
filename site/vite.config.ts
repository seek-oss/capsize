import {
  defineConfig,
  defaultClientConditions,
  defaultServerConditions,
} from 'vite';
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
    // Tell Vite to load workspace packages directly from the source TypeScript files.
    conditions: ['@capsizecss/src', ...defaultClientConditions],
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
    resolve: {
      conditions: ['@capsizecss/src', ...defaultServerConditions],
    },
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
    // See src/renderer/+config.ts for Vike configuration
    vike(),
    imagetools(),
    inspect(),
  ],
}));
