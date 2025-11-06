module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      { bugfixes: true, targets: { node: 'current' }, modules: false },
    ],
  ],
};
