//  has to add all of these due to webpack 5
const webpack = require('webpack')

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  actions.setWebpackConfig({

    devtool: false,

    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        stream: require.resolve('stream-browserify'),
        os: require.resolve('os-browserify/browser'),
        assert: require.resolve('assert/'),
        url: require.resolve('url'),
        Buffer: [require.resolve('buffer/'), 'Buffer']
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer']
      })
    ]
  })

  // [web3-providers-ws]/lib/helpers.js:23:1 - looks for process
  // node_modules/util/util.js - looks for process
  // web3.min.js - window is not defined
  if (stage === 'build-html' || stage === 'develop-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /helpers\.js|util\.js|web3\.min\.js/,
            use: loaders.null()
          }
        ]
      }
    })
  }
//   if (stage === 'build-html') {
//     actions.setWebpackConfig({
//       resolve: {
//         alias: {
//           process: 'process/browser'
//         }
//       }
//     })
//   }
}
