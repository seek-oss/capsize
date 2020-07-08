/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  if (stage === 'develop' || stage === 'build-javascript') {
    actions.setWebpackConfig({
      node: {
        fs: 'empty',
      },
      module: {
        rules: [
          {
            enforce: 'post',
            test: /fontkit[/\\]index.js$/,
            loader: 'transform-loader',
            options: { brfs: true },
          },
        ],
      },
    });
  }

  if (stage === 'build-html') {
    const config = getConfig();

    const [gatsbyExternals] = config.externals;

    function externals(context, request, callback) {
      if (request.indexOf('fontkit') > -1) {
        return callback(null, `commonjs ${request}`);
      }

      return gatsbyExternals(context, request, callback);
    }

    config.externals = [externals];

    actions.replaceWebpackConfig(config);
  }
};

// exports.onCreateBabelConfig = ({ stage, actions }) => {
//   if (stage === 'develop' || stage === 'build-javascript') {
//     actions.setBabelPlugin({
//       name: `babel-plugin-static-fs`,
//       options: {
//         target: 'browser',
//       },
//     });
//   }
// };
