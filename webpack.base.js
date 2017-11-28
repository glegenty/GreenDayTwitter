const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

const DIST_DIR   = path.join(__dirname, "dist"),  
    CLIENT_DIR = path.join(__dirname, "src")

module.exports = {  
    // context: CLIENT_DIR,
    entry: [
      CLIENT_DIR,
    ],
    output: {
        path:     DIST_DIR,
        publicPath: '/',        
        filename: "bundle.js"
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.ejs',
        alwaysWriteToDisk: true
        
      }),
      // new HtmlWebpackHarddiskPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpg|svg)$/,
          use: {
            loader: "url-loader",
            options: {
              limit: 15000,
              name: "[name].[ext]",
            }
          }
        }
      ],
    },
    resolve: {
      modules: [
        path.resolve('./node_modules')        
      ]      
    }
}