const webpack = require('atool-build/lib/webpack');
const pxtorem = require('postcss-pxtorem');


module.exports = function(webpackConfig, env) {
  webpackConfig.babel.plugins.push('transform-runtime')
  ;[
    pxtorem({
      rootValue: 100,
      propWhiteList: [],
    }),
  ];

  webpackConfig.babel.plugins.push([
    'import',
    {
      libraryName: 'antd',
      style: true,
    },
  ]);

  // Support hmr
  if (env === 'development') {
    webpackConfig.devtool = '#eval';
    webpackConfig.babel.plugins.push('dva-hmr');
  } else {
    webpackConfig.babel.plugins.push('dev-expression');
  }

  // Don't extract common.js and common.css
  //  webpackConfig.plugins = webpackConfig.plugins.filter(function(plugin) {
  //    return !(plugin instanceof webpack.optimize.CommonsChunkPlugin);
  //  });

  // Support CSS Modules
  // Parse all less files as css module.
  webpackConfig.module.loaders.forEach(function(loader, index) {
    if (
      typeof loader.test === 'function' &&
      loader.test.toString().indexOf('\\.less$') > -1
    ) {
      loader.include = /node_modules/;
      loader.test = /\.less$/
      ;/\.css$/
      ;('style!css!postcss');
    }
    if (loader.test.toString() === '/\\.module\\.less$/') {
      loader.exclude = /node_modules/;
      loader.test = /\.less$/
      ;/\.css$/
      ;('style!css!postcss');
    }
  });

  return webpackConfig;
};
