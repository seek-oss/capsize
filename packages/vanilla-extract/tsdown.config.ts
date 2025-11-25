import { defineConfig } from 'tsdown';
import { baseConfig } from '../../tsdown.base.config.ts';
import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';

export default defineConfig({
  ...baseConfig,
  unbundle: true,
  plugins: [
    vanillaExtractPlugin({
      unstable_injectFilescopes: true,
    }),
  ],
});
