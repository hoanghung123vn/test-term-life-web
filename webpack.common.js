const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const rootPath = path.join(__dirname, './');
const buildRainbowModule = [];
if (require(rootPath + 'package-lock.json')['lockfileVersion'] < 3) {
    for (let lockKey in require(rootPath + 'package-lock.json')['dependencies']) {
        if (lockKey.indexOf('rainbowui') > -1) {
            buildRainbowModule.push(path.resolve(__dirname, './node_modules/' + lockKey));
        }
    }
} else {
    for (let lockKey in require(rootPath + 'package-lock.json')['packages']) {
        if (lockKey.indexOf('rainbowui') > -1) {
            buildRainbowModule.push(path.resolve(__dirname, lockKey));
        }
    }
}
const buildOption = {
    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
    plugins: ['@babel/plugin-transform-modules-commonjs', '@babel/plugin-transform-runtime', '@babel/plugin-transform-async-to-generator', '@babel/plugin-transform-strict-mode', '@babel/plugin-syntax-dynamic-import']
};
module.exports = {
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css'
        }),
        new ESLintPlugin({
            // context: path.resolve(__dirname, './src'), // file root directory
            extensions: ['js', 'jsx', 'ts', 'tsx']
        })
    ],
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[chunkhash].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {// First package less-loader into css, then package it into a js file through css-loader, and then insert it into html in the form of a header tag through style-loader
                test: /\.(css|less)$/,
                exclude: /(node_modules)/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {// First package less-loader into css, then package it into a js file through css-loader, and then insert it into html in the form of a header tag through MiniCssExtractPlugin.loader
                test: /\.(css|less)$/,
                include: /(node_modules)/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            },
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(js|jsx|ts|tsx)$/,
                include: buildRainbowModule,
                use: {
                    loader: 'babel-loader',
                    options: buildOption
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                exclude: /(static)/,
                use: {
                    loader: 'url-loader',
                    options: {
                        esModule: false
                    }
                }
            },
            { test: /\.md$/, use: ['raw-loader'] }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, './src/'),
            config: path.resolve(__dirname, './src/config/config.js'),
            i18n: path.resolve(__dirname, './src/i18n/index.js'),
            ctConfig: path.resolve(__dirname, './src/config/codeTableName.json')
        },
        fallback: {
            url: false
        }
    }
};
