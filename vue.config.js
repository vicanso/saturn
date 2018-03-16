const webpack = require('webpack');
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
    plugins: [
      new webpack.DefinePlugin({
        ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        APP: JSON.stringify('novel'),
        URL_PREFIX: JSON.stringify('/api'),
      }),
    ],
  },
};
