const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');

module.exports = {
  stories: ['../packages/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-viewport'],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: (config) => {
    config.plugins.push(new VanillaExtractPlugin());
    return config;
  },
};
