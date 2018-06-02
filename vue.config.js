const webpack = require('webpack');

const pkg = require('./package.json');
const target = process.env.VUE_APP_TARGET || 'web';

const output = {};
let urlPrefix = '/api';

if (target === 'app') {
  output.publicPath = './';
  urlPrefix = 'https://xs.aslant.site/api';
}

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://xs.aslant.site',
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
