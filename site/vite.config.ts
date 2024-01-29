import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  build: {
    commonjsOptions: {
      // defaultIsModuleExports: true,
      include: [/\bpackages\b/, /node_modules/],
      // requireReturnsDefault: 'auto',
    },
    rollupOptions: {
      external: () => false,
    },
  },
  optimizeDeps: {
    // force: true,
    include: ['@capsizecss/metrics/roboto', '@capsizecss/metrics/abrilFatface'],
  },
  plugins: [
    nodePolyfills({
      include: ['buffer'],
    }),
    react({
      jsxImportSource: '@emotion/core',
    }),
    ViteImageOptimizer(),
  ],
});
