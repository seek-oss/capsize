module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', { targets: 'last 2 Chrome versions' }],
  ],
};
