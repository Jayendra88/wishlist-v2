import path from 'path'

import type { Configuration } from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'

const src = '../checkout-ui-custom'

const config: Configuration = {
  mode: 'production',
  entry: ['./ts/index.ts', `./stylings/stylings.css`],
  output: {
    filename: 'checkout6-custom.js',
    path: path.resolve(__dirname, src),
    clean: true,
  },
  watchOptions: {
    ignored: ['/checkout-ui-custom/', '/node_modules/'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-typescript', { allowNamespaces: true }],
            ],
          },
        },
      },
      {
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        test: /.(css|sass|scss)$/,
      },
      {
        type: 'asset',
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            ecma: 2016,
            passes: 3,
          },
          format: {
            comments: false,
          },
        },
        extractComments: true,
      }),
      new CssMinimizerPlugin(),
    ],
    minimize: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'checkout6-custom.css',
      ignoreOrder: false,
    }),
  ],
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
}

export default config
