const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
// const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common');
const { GenerateSW } = require('workbox-webpack-plugin');
const MyPlugin = require('./indexHtmlPlugin');
let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
let res = '';
for (let i = 0; i < 10; i++) {
    let id = Math.ceil(Math.random() * 35);
    res += chars[id];
}

module.exports = webpackMerge.merge(common, {
    mode: 'production',
    devtool: false,
    entry: {
        app: [
            './src/index.tsx'
        ]
    },
    output: {
        path: path.join(__dirname, 'dist/release/'),
        filename: '[name].[chunkhash].bundle.js',
        chunkFilename: '[name].[chunkhash:8].bundle.js',
        publicPath: './'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './index.html'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/config/config.json', to: 'uiConfig.js' }
            ]
        }),
        new webpack.ProvidePlugin({
            i18n: 'i18n'
        }),
        new MyPlugin({ version: res, env: 'production' }),
        new GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
            exclude: [/\.map$/]
        })
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
        },
        minimize: true,
        minimizer: [new TerserPlugin({
            parallel: true, // 是否并行打包
            include: /\.(js|jsx)$/,
            exclude: ['uiConfig.js']
        })]
    }
});
