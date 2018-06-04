const webpack = require('webpack');

const pkg = require('./package.json');
const target = process.env.VUE_APP_TARGET || 'web';

const output = {};
const apiUrl = 'http://47.52.232.157';
let urlPrefix = '/api';

if (target === 'app') {
  output.publicPath = './';
  urlPrefix = apiUrl + urlPrefix;
}

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: apiUrl,
        changeOrigin: true,
        // target: 'http://127.0.0.1:5018',
      },
    },
  },
  configureWebpack: {
    output,
    plugins: [
      new webpack.DefinePlugin({
        ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        URL_PREFIX: JSON.stringify(urlPrefix),
        TARGET: JSON.stringify(target),
        VERSION: JSON.stringify(pkg.version),
      }),
    ],
  },
};
