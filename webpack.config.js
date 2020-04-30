var path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var webpack = require('webpack');
const args = process.argv.slice(2);
const fileName = args[0];

 module.exports = {
     mode: "production",
     entry: fileName,
     output: {
         path: path.resolve(__dirname, 'build'),
         libraryTarget: "commonjs",
         filename: 'script.es5.js'
     },
     optimization: {
        minimizer: [
          new UglifyJsPlugin({
            uglifyOptions: {
              compress: false,
              mangle: false,
              output: {
                comments: false,
                beautify: true,
              },
            },
          }),
        ],
      },
     module: {
         rules: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
             }
         ]
     },
     stats: {
         colors: true
     },
     target: "web",
         externals: /k6(\/.*)?/,
     devtool: 'source-map'
 };
