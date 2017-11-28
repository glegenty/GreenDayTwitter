const webpack    = require('webpack'),  
    baseConfig = require('./webpack.base.js')

baseConfig.entry = ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/index.js']

baseConfig.output.publicPath = '/'
baseConfig.devtool = '#source-map'

baseConfig.plugins = baseConfig.plugins.concat(baseConfig.plugins, [  
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
])


module.exports = baseConfig  