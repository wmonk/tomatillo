var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-hot-middleware/client?path=http://localhost:3001/__webpack_hmr',
        './view/index.js'
    ],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'http://localhost:3001/dist/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [{
            test: /js$/,
            loader: 'babel',
            include: [/view/g],
            query: {
                presets: ['react', 'es2015']
            }
        }]
    },
    target: 'electron'
}
