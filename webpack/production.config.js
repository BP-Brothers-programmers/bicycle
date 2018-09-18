const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const SOURCE_PATH = '../assets';
const OUTPUT_PATH = '../app/assets/javascripts';

module.exports = merge([{
    entry: [
        path.join(__dirname, SOURCE_PATH, 'main.js')
    ],
    output: {
        path: path.join(__dirname, OUTPUT_PATH),
        filename: 'main.js',
        publicPath: './'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
        ]
    },
    plugins: [
        new UglifyJsPlugin({
            extractComments: false,
            parallel: 4,
            sourceMap: false
        }),
    ]
}]);
