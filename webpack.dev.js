const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const args = process.argv.splice(2);
const port = parseInt(args[1].split('=')[1]);

const path = require('path');
const common = require('./webpack.common');


module.exports = webpackMerge.merge(common, {
    mode: 'development',
    devtool: 'eval',
    entry: {
        app: [
            'webpack/hot/only-dev-server',
            // 'react-hot-loader/patch',
            './src/index.tsx'
        ]
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].[chunkhash:8].chunk.js',
        path: path.join(__dirname, 'dist'),
        publicPath: '/'
    },
    devServer: {
        hot: true,
        // disableHostCheck: true,
        allowedHosts: 'all',
        static: {
            directory: path.join(__dirname, 'dist/dev/')
        },
        compress: true, // gzip compression
        port: port,
        historyApiFallback: true
        // proxy: {
        //     '/appframework-bff-app': {
        //         target: 'http://localhost:80',
        //         changeOrigin: true,
        //         pathRewrite: { '^/appframework-bff-app': '' }
        //     }
        // }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: './index.html', 
            template: './index.html'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/config/config.json', to: 'uiConfig.js' }
            ]
        }),
        new webpack.ProvidePlugin({
            i18n: 'i18n'
        })
        // new ManifestPlugin()
        // new WebpackManifestPlugin()
        // new webpack.NamedModulesPlugin()
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    name: 'common',
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                }
            }
        },
        runtimeChunk: {
            name: 'manifest'
        }
    },
    snapshot: {
        managedPaths: []
    }
});
