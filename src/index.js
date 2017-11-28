import visualiser from './components/visualizer'
import '../static/main.css'
console.log('yo')
document.querySelector('body').innerHTML = '<H1> HELLO </H1>'
const socket = new io();
console.log(socket)

socket.on('tweet', (tweet) => {
  console.log(tweet.text)
})

if (module.hot) {  
  module.hot.accept();
 }
