const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.s?css$/i,
        use: [MiniCSSExtractPlugin.loader],
      },
    ],
  },
};
