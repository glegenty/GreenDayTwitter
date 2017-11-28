import path from 'path'  
import http from 'http'
import express from 'express'  
import webpack from 'webpack'
import io from 'socket.io' 
import Twit from 'twit'

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
app.use(express.static(DIST_DIR));


app.get('*', (req, res, next) => {
  const filename = path.join(compiler.outputPath,'index.html')
  console.log(filename)
  compiler.outputFileSystem.readFile(filename, function(err, result){
    if (err) {
      return next(err)
    }
    console.log(result)
    res.set('content-type','text/html')
    res.send(result)
    res.end()
  })
  // res.sendFile(__dirname + '/dist/index.html')    
})


const server = http.createServer(app)
server.listen(process.env.PORT || DEFAULT_PORT, function() {
  console.log('Listening on %j', server.address())
})
var T = new Twit({
  consumer_key:         'tIWMLrOGlscGL4QLLSOv9kXpt',
  consumer_secret:      'NAxdxG1WNlJMPHNYHoUY3TA0Oph0KatJqlvZaeiSQUgbWyNE2y',
  access_token:         '166345154-UQbO8kEa9ott4HlJvK407EhGpyIaoMzo3VolRNr1',
  access_token_secret:  'WrtoB1HSGLfJlwZOwOAD4IjBONY1b0QqxI7Pm855dUKRb',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})
const socket = io().listen(server)
socket.on('connection', () => console.log('new connection'))

const stream = T.stream('statuses/filter', { track: '#greenday' })

stream.on('tweet', function (tweet) {  
  socket.emit('tweet', tweet)  
})

