module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', { targets: 'last 2 Chrome versions, last 2 Firefox versions' }],
  ],
};
