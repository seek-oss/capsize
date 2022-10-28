module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', { targets: { node: 14, browsers: 'since 2017-06' } }],
  ],
};
