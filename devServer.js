const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config');
const app = express();
const compiler = webpack(config);
const PORT = process.env.PORT || 3000;

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, err => err ? console.error(err) : console.log(`🌍  Listening on port ${PORT}`));
