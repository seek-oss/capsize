/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
exports.onCreateWebpackConfig = ({ stage, actions }) => {
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
