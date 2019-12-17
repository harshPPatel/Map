// Plugins
const CopyPlugin = require('copy-webpack-plugin');

// Exporting common webpack configuration
module.exports = {
  // Entry points
  entry: './source/index.js',

  // Dev tools Configuration
  devtool: 'source-maps',

  // Plugins
  plugins: [
    // Copy plugin to copy all files from './source/favico' to root of the project
    new CopyPlugin([
      {
        from: './source/favicon',
        to: './',
      },
      {
        from: './source/json',
        to: './json',
      },
    ]),
  ],

  // Modules
  module: {
    // Rules
    rules: [
      // Html Module Configuration
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'link:href', 'source:src'],
              interpolate: true,
            },
          },
        ],
      },

      // JOSN Module Configuration. Copies json files to build folder
      {
        test: /\.json$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/json',
          },
        },
      },

      // Handles requests to '.ico' and '.webmanifest' files inside HTML
      {
        test: /\.(ico|webmanifest)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: '.',
          },
        },
      },
    ],
  },
};
