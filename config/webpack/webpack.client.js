const CleanWebpackPlugin = require('clean-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const commonConfig = require('./webpack.common');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ngtools = require('@ngtools/webpack');
const path = require('path');
const postCssOptions = require('./post-css-options');
const PurifyPlugin = require('@angular-devkit/build-optimizer').PurifyPlugin;
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const environment = process.env.NODE_ENV || 'development';
const extraRules = [];
const extraPlugins = [];

if (environment === 'production') {
  extraRules.push(
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
      test: /\.js$/,
      loader: '@angular-devkit/build-optimizer/webpack-loader'
    }
  );

  extraPlugins.push(
    new ngtools.AotPlugin({
      tsConfigPath: path.join(__dirname, '..', '..', 'tsconfig.json'),
      exclude: [
        '**/*.spec.ts'
      ],
      skipCodeGeneration: false
    }),
    // Purify plugin must come before the uglify plugin
    new PurifyPlugin({

    }),
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
        drop_debugger: true,
        pure_getters: true,
        passes: 3
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
    // Specify the correct order the scripts will be injected in
    new webpack.optimize.CommonsChunkPlugin({
      name: ['polyfills', 'vendors'].reverse()
    })
  );
} else {
  extraRules.push(
    {
      test: /\.ts$/,
      exclude: [
        /\.(spec|e2e)\.ts$/
      ],
      use: [
        {
          loader: 'awesome-typescript-loader'
        },
        {
          loader: 'angular-router-loader'
        },
        {
          loader: 'angular2-template-loader'
        }
      ]
    }
  );
  extraPlugins.push(
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
        enforce: 'pre',
        test: /\.js$/,
        exclude: [
          /node_modules/
        ],
        loader: 'source-map-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
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
        test: /src[\\|\/]web[\\|\/]styles.scss$/,
        enforce: 'post',
        loader: 'style-loader'
      }
    ].concat(extraRules)
  },
  node: {
    fs: 'empty',
    // `global` should be kept true, removing it resulted in a
    // massive size increase with Build Optimizer on AIO.
    global: true,
    crypto: 'empty',
    tls: 'empty',
    net: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  },
  plugins: [
    new StatsWriterPlugin({
      filename: '../client-stats.json',
      fields: null
    }),
    new CircularDependencyPlugin(),
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
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '..', '..')
    })
  ].concat(extraPlugins)
});
