import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import type { StorybookConfig } from '@storybook/html-vite';
import { defaultClientConditions, defaultServerConditions } from 'vite';

export default {
  stories: ['../packages/**/*.stories.@(ts|tsx)'],
  framework: '@storybook/html-vite',
  core: {
    builder: '@storybook/builder-vite',
  },
  viteFinal: (config) => {
    config.plugins ??= [];
    config.plugins.push(vanillaExtractPlugin());

    config.resolve = {
      // Tell Vite to load workspace packages directly from the source TypeScript files.
      conditions: ['@capsizecss/src', ...defaultClientConditions],
    };

    config.ssr ??= {};
    config.ssr.resolve = {
      // Tell Vite to load workspace packages directly from the source TypeScript files.
      conditions: ['@capsizecss/src', ...defaultServerConditions],
    };

    return config;
  },
} satisfies StorybookConfig;
