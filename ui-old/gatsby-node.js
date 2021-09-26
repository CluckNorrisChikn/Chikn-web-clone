//  has to add all of these due to webpack 5
const webpack = require('webpack');

exports.onCreateWebpackConfig = ({ actions }) => {
    actions.setWebpackConfig({
        
        externals: {
            electron: 'electron',
        },
        resolve: {
            fallback: {
                crypto: require.resolve('crypto-browserify'),
                http: require.resolve('stream-http'),
                https: require.resolve('https-browserify'),
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                os: require.resolve('os-browserify/browser'),
                assert: require.resolve('assert/'),
                url: require.resolve('url'),
                Buffer: [require.resolve("buffer/"), "Buffer"],
            },
        },
        plugins: [
            new webpack.ProvidePlugin({
                 Buffer: ['buffer', 'Buffer'],
                 process: 'process/browser',
            }),
        ],
    })
}