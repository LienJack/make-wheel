const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: './dist/bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      include: path.join(__dirname, './src'),
      loader: 'babel-loader'
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    alias: {
      wheel: './wheel'
    }
  },
  devServer: {
    contentBase: path.join(__dirname, './dist'), // 更目录
    open: true,
    port: 9000
  }
}