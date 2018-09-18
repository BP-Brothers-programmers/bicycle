const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

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
    }
}]);
