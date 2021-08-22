module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', { targets: 'defaults' }],
  ],
  plugins: ['@vanilla-extract/babel-plugin'],
};
