var path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var webpack = require('webpack');

const args = process.argv.slice(2);
const fileName = args[0];
const outFilename = path.basename(fileName, path.extname(fileName))+'.es5.js';

module.exports = {
    mode: "production",
    entry: fileName,
    output: {
         path: path.resolve(path.dirname(fileName)),
         libraryTarget: "commonjs",
         filename: outFilename
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
         externals: /^k6(\/.*)?/,
     devtool: 'source-map'
};
