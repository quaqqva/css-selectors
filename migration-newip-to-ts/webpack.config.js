const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const postCSSPresetEnv = require('postcss-preset-env');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const baseConfig = {
  entry: path.resolve(__dirname, './src/index.ts'),
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
    }),
    new MiniCSSExtractPlugin({ filename: 'styles.css' }),
  ],
  module: {
    rules: [
      {
        test: /\.html/i,
        loader: 'html-loader',
      },
      {
        test: /\.s?css$/i,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [postCSSPresetEnv],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.ts$/i,
        use: ['ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.png$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
};

module.exports = ({ mode }) => {
  const isProductionMode = mode === 'prod';
  const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

  return merge(baseConfig, envConfig);
};
