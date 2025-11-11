import { type UserConfig } from 'tsdown';

export const baseConfig: UserConfig = {
  entry: './src/index.ts',
  exports: {
    devExports: '@capsizecss/src',
  },
  format: ['cjs', 'esm'],
};
