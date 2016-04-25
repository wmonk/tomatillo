var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        './view/index.js'
    ],
    output: {
        filename: 'prod.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        loaders: [{
            test: /js$/,
            loader: 'babel',
            include: path.join(__dirname, 'view'),
            query: {
                presets: ['react', 'es2015']
            }
        }]
    },
    target: 'electron'
}
