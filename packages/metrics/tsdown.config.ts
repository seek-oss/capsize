import { defineConfig } from 'tsdown';
import { baseConfig } from '../../tsdown.base.config.ts';

export default defineConfig({
  ...baseConfig,
  entry: ['src/index.ts', 'src/entireMetricsCollection.ts'],
  exports: {
    ...(typeof baseConfig.exports !== 'boolean' ? baseConfig.exports : {}),
    customExports(pkg) {
      // Add manually built entries for each generated set of font metrics
      pkg['./*'] = {
        import: './entireMetricsCollection/*/index.mjs',
        require: './entireMetricsCollection/*/index.cjs',
      };

      return pkg;
    },
  },
});
