const webpack = require('webpack');
const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: {
		"easy-map": isProduction ? path.resolve('./src/index.js') : path.resolve('./demo/index.js'),
	},
  devServer: {
    contentBase: path.resolve('./demo'),
    inline: true,
    hot: true,
    host: '0.0.0.0',
    port: 7777,
    historyApiFallback: true,
  },
  output: {
    filename: '[name].min.js',
    path: isProduction ? path.resolve('.') : path.resolve('./demo'),
    publicPath: '/',
    library: 'EasyMap',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      'node_modules',
      path.resolve('./src'),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
      },
    }),
  ],
  module: {
    loaders: [{
			enforce: 'pre',
			test: /\.js$/,
			loader: 'eslint-loader',
			include: path.resolve('./src'),
			options: {
				failOnWarning: true,
				failOnError: true,
				emitWarning: true,
			},
		}, {
			test: /\.js$/,
			use: 'babel-loader',
			exclude: /node_modules|bower_components/,
		}],
  },
  externals: {
    google: 'google',
    naver: 'naver',
    daum: 'daum',
  },
};

if (!isProduction) {
  config.devtool = 'eval-source-map';
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

module.exports = config;
