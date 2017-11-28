import path from 'path'  
import http from 'http'
import express from 'express'  
import webpack from 'webpack'
import socket from 'socket.io'  
import webpackDevMiddleware from 'webpack-dev-middleware'  
import webpackHotMiddleware from 'webpack-hot-middleware'  
import config from './webpack.dev.js'

const app           = express(),  
      DIST_DIR      = path.join(__dirname, 'dist'),
      HTML_FILE     = path.join(DIST_DIR, 'index.html'),
      DEFAULT_PORT  = 3000,
      compiler      = webpack(config)

app.set('port', process.env.PORT || DEFAULT_PORT)

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler, {
  log: console.log, 
  // path: '/__webpack_hmr', 
  heartbeat: 10 * 1000
}))

app.get('*', (req, res, next) => {
  const filename = path.join(compiler.outputPath,'index.html');
  console.log(filename)
  compiler.outputFileSystem.readFile(filename, function(err, result){
    if (err) {
      return next(err);
    }
    console.log(result)
    res.set('content-type','text/html');
    res.send(result);
    res.end();
  })
  // res.sendFile(__dirname + '/dist/index.html')    
})


const server = http.createServer(app);
server.listen(process.env.PORT || DEFAULT_PORT, function() {
  console.log('Listening on %j', server.address());
});

const io = socket().listen(server)

io.on('connection', () => console.log('new connection'));
