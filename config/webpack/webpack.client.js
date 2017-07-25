const CleanWebpackPlugin = require('clean-webpack-plugin');
const commonConfig = require('./webpack.common');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ngtools = require('@ngtools/webpack');
const path = require('path');
const postCssOptions = require('./post-css-options');
const StatsPlugin = require('stats-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const environment = process.env.NODE_ENV || 'development';
const extraPlugins = [];

if (environment === 'production') {
  extraPlugins.push(
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      output: {
        comments: false
      },
      mangle: {
        screw_ie8: true,
        except: ['$']
      },
      compress: {
        screw_ie8: true,
        warnings: false,
        collapse_vars: true,
        reduce_vars: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        drop_console: true,
        drop_debugger: true
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'polyfills',
      chunks: ['polyfills']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      chunks: [
        'app', 'styles'
      ],
      minChunks: module => /node_modules\//.test(module.resource)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      chunks: [
        'app', 'styles'
      ],
      minChunks: 2
    }),
    new StatsPlugin('../client-stats.json', 'verbose'),
    // Specify the correct order the scripts will be injected in
    new webpack.optimize.CommonsChunkPlugin({
      name: ['polyfills', 'vendors'].reverse()
    })
  );
} else {
  extraPlugins.push(
    new StatsPlugin('../client-stats.json', 'verbose'),
    // Specify the correct order the scripts will be injected in
    new webpack.optimize.CommonsChunkPlugin({
      name: ['polyfills', 'vendors'].reverse()
    })
  )
}

module.exports = webpackMerge.smart(commonConfig, {
  target: 'web',
  entry: {
    app: './src/web/main.app.ts',
    polyfills: './src/web/polyfills.ts',
    styles: './src/web/styles.scss'
	},
  output: {
    path: path.join(__dirname, '..', '..', 'dist', 'client')
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'raw-loader'
          },
          {
            loader: 'postcss-loader',
            options: postCssOptions
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'raw-loader'
          },
          {
            loader: 'postcss-loader',
            options: postCssOptions
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.ts$/,
        exclude: [
          /\.(spec|e2e)\.ts$/
        ],
        use: [
          {
            loader: '@ngtools/webpack'
          }
        ]
      },
      {
        test: /src[\\|\/]web[\\|\/]styles.scss$/,
        enforce: 'post',
        use: [
          {
            loader: 'style-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        htmlLoader: {
          minimize: true,
          removeAttributeQuotes: false,
          caseSensitive: true,
          customAttrSurround: [
            [/#/, /(?:)/],
            [/\*/, /(?:)/],
            [/\[?\(?/, /(?:)/]
          ],
          customAttrAssign: [/\)?\]?=/]
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', '..', 'src', 'web', 'index.html'),
      chunksSortMode: (chunk1, chunk2) => {
        var orders = ['polyfills', 'vendors', 'styles', 'app'];
        var order1 = orders.indexOf(chunk1.names[0]);
        var order2 = orders.indexOf(chunk2.names[0]);

        return order1 - order2;
      }
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '..', '..', 'src', 'web', 'assets'),
        to: path.resolve(__dirname, '..', '..', 'dist', 'client', 'assets')
      }
    ]),
    new ngtools.AotPlugin({
      tsConfigPath: path.join(__dirname, '..', '..', 'tsconfig.json'),
      exclude: [
        '**/*.spec.ts'
      ],
      skipCodeGeneration: environment === 'development'
    }),
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '..', '..')
    })
  ].concat(extraPlugins)
});
