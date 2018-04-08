const webpack = require('webpack');

const target = process.env.VUE_APP_TARGET || 'web';

const output = {};
let urlPrefix = '/api';

if (target === 'app') {
  output.publicPath = './';
  urlPrefix = 'http://xs.aslant.site/api';
}

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://xs.aslant.site',
        target: 'http://127.0.0.1:5018',
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
      }),
    ],
  },
};
