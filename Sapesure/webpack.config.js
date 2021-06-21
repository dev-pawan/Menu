const path = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    globalObject: 'this',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true,
      filename: 'index.html',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ].concat(isDev ? [] : new MiniCssExtractPlugin()),

  module: {
    rules: [
      {
        // Exposes jQuery for use outside Webpack build
        test: require.resolve('jquery'),
        loader: 'expose-loader',
        options: {
          exposes: ['$', 'jQuery'],
        },
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /.s[ac]ss$/i,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        // https://webpack.js.org/guides/asset-modules/#replacing-inline-loader-syntax
        resourceQuery: /raw/,
        type: 'asset/source',
      },
      {
        // https://webpack.js.org/loaders/html-loader/#usage
        resourceQuery: /template/,
        loader: 'html-loader',
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/image',
            },
          },
        ],
      },
    ],
  },
};
