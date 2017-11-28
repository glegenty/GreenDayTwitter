import Visualiser from './components/visualizer'
import '../static/main.css'
import {loader} from 'pixi.js'


const App = (function (){
  const app = {}
  app.run = () => {
    console.log(loader.resources.part)
    
    
    app.visualizer = new Visualiser()
    app.socket = new io()
    
    app.render()
    app.socket.on('tweet', (tweet) => {
      app.visualizer.changeText(tweet.text)
      console.log(tweet.text)
    })
  }
  app.render = () => {
    app.visualizer.render()
    requestAnimationFrame(app.render);
  }
  return app
})()

console.log(loader)

loader
  .add('part', './static/img/leaf.svg')
  .load(App.run)



if (module.hot) {  
  module.hot.accept()
 }
