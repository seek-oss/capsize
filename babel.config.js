module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', { targets: { node: 12, browsers: 'since 2017-06' } }],
  ],
  plugins: ['@vanilla-extract/babel-plugin'],
};
