const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  
  devtool: false,
  
  // devtool: isProd
  //   ? false
  //   : '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    extensions: [ '.js', '.vue' ],
    alias: {
      'public': path.resolve(__dirname, '../public'),
      'components': path.resolve(__dirname, '../src/components'),
      'pages': path.resolve(__dirname, '../src/pages'),
      'src': path.resolve(__dirname, '../src'),
      'build': path.resolve(__dirname, './'),
    }
  },

  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {compact: false}
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        exclude: /node_modules/,
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
    ]
  },
  performance: {
    hints: false
  },
  plugins: isProd
    ? [
        new VueLoaderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false }
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ExtractTextPlugin({
          filename: 'common.[chunkhash].css'
        })
      ]
    : [
        new VueLoaderPlugin(),
        new FriendlyErrorsPlugin()
      ]
}
