const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');

module.exports = {
  stories: ['../packages/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-viewport'],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: (config) => {
    config.plugins.push(new VanillaExtractPlugin());
    // Enables webpack to resolve workspace packages from source TypeScript files.
    // The `...` entry preserves the default conditions (like 'import', 'require', etc).
    // See: https://webpack.js.org/configuration/resolve/#resolveconditionnames
    config.resolve.conditionNames = ['@capsizecss/src', '...'];
    return config;
  },
};
