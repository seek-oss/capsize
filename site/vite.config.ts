import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
// import { unstable_vitePlugin as remix } from '@remix-run/dev';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  build: {
    commonjsOptions: {
      defaultIsModuleExports: true,
      include: [/\bpackages\b/, /node_modules/],
      requireReturnsDefault: 'auto',
    },
    rollupOptions: {
      external: () => false,
    },
  },
  optimizeDeps: {
    force: true,
    include: ['@capsizecss/metrics/roboto', '@capsizecss/metrics/abrilFatface'],
  },
  plugins: [
    nodePolyfills({
      include: ['buffer'],
    }),
    react({
      jsxImportSource: '@emotion/react',
    }),
    // remix({ unstable_ssr: false }),
    ViteImageOptimizer(),
  ],
});
