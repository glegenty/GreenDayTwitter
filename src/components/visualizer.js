import * as PIXI from 'pixi.js'
import {TweenMax, Power2} from "gsap";

export default class Visualizer {
  constructor(opts) {
    opts = opts || {}
    this.resolution = opts.resolution || 6
    this.cW = window.innerWidth
    this.cH = window.innerHeight
    this.leaves = []
    this.score = 0
    this.scoreText = document.querySelector('.score__count')
    // this.particles = new PIXI.particles.ParticleContainer(100000)
    this.particles = new PIXI.Container()
    
    this.texture = PIXI.loader.resources['part'].texture
    console.log(this.texture)
    this.renderer = PIXI.autoDetectRenderer(this.cW, this.cH, {antialias: false, transparent: true, resolution: 1})
    this.stage = new PIXI.Container()
    this.init()
  }

  init () {
    document.querySelector('.pixi-output').appendChild(this.renderer.view)
    this.particles.buttonMode = true
    this.particles.interactive = true;
    
    this.particles.on('click', this.explode.bind(this))
    this.stage.addChild(this.particles)
    const dummy = new PIXI.Sprite(this.texture)
    dummy.x = this.cW /2
    dummy.y = this.cH /2
    // this.particles.addChild(dummy)
    this.initWordCanvas()
    this.initDebug()
  }

  initWordCanvas () {
    this.wordCanvas = document.createElement('canvas')
    this.wordCanvas.width = this.cW
    this.wordCanvas.height = this.cH
    this.wordCtx = this.wordCanvas.getContext('2d')
    this.wordCanvas.style.opacity = 0
    document.querySelector('#App').appendChild(this.wordCanvas)
    this.changeText('#GreenDay')
  }
  getTextPosition () {
    const imageData = this.wordCtx.getImageData(0, 0, this.cW, this.cH)
    let i = 0
    let index = 0
    for (let x = 0; x < imageData.width; x += this.resolution) {
      for (let y = 0; y < imageData.height; y += this.resolution) {
        let i = (y * imageData.width + x) * 4;
        if (imageData.data[i + 3] > 128) {
          if (index >= this.leaves.length) {
            this.leaves[index] = new PIXI.Sprite(this.texture)

            this.particles.addChild(this.leaves[index])
            
            // console.log(1)
 
          }
          this.leaves[index].rotation = Math.random() * Math.PI
          this.leaves[index].alpha = Math.random() * (1 - 0.3) + 0.3         
          this.leaves[index].tint = Math.random() > 0.5 ? 0x43e97b : 0x38f9d7
          this.leaves[index].scale.set((Math.random() * (0.15 - 0.09) + 0.09) * this.fontSize / 200)  
          TweenMax.fromTo(this.leaves[index], Math.random() * (1 - 0.2) + 0.2, {x: x + Math.random() * (100 - (-100)) -100, y: y + Math.random() * (100 - (-100)) -100}, {x: x, y: y, ease: Power2.easeOut})      
          
          index++
        }
      }
    }
    console.log(this.leaves.length - index > 0)
    let toDestroy = this.leaves.slice(index, this.leaves.length);
    toDestroy.forEach((element) => element.destroy())
    this.leaves.splice(index, this.leaves.length - index);
    
    this.leaves.length - index > 0 && this.particles.removeChildren(this.leaves.length - index, this.leaves.length)
    
  }
  changeText (tweet) {
    // let text = this.formatText(tweet)
    let text = tweet
    // this.wordCtx.clearRect(0, 0, this.cW, this.cH)
    // this.wordCtx.font = '250px sans-serif'
    // this.wordCtx.textAlign = 'center'
    // this.wordCtx.fillText(text, this.cW/2, this.cH/2)

    let letters = text.split('\n')
    let fontSize = 200
    let wordWidth = 0
    do {
      wordWidth = 0
      fontSize -= 4
      this.wordCtx.font = fontSize + "px  sans-serif"
      for (let i = 0; i < letters.length; i++) {
        let w = this.wordCtx.measureText(letters[i]).width;
        if (w > wordWidth) wordWidth = w;
      }
    } while (wordWidth > this.cW - 50 || fontSize * letters.length > this.cH - 50);
    this.fontSize = fontSize    
    this.wordCtx.clearRect(0, 0, this.cW, this.cH)
    this.wordCtx.textAlign = "center";
    this.wordCtx.textBaseline = "middle";
    for (var i = 0; i < letters.length; i++) {
      this.wordCtx.fillText(letters[i], this.cW / 2, this.cH / 2 - fontSize * (letters.length /
        2 - (i + 0.5)));
    }

    this.getTextPosition()
    
  }

  formatText (tweet) {
    let text = tweet.replace(/#(\S*)/g, '')
    return text
  }
  initDebug () {
    const btn = document.querySelector('.btn-changeText')
    const input = document.querySelector('.debugText')
    
    btn.addEventListener('click', () => {
      this.changeText(input.value)
    })


  }

  explode () {
    this.leaves.forEach((leaf) => {
      TweenMax.to(leaf.scale, Math.random() * (1.5 - 0.2) + 0.2, {x: 0, y: 0, ease: Power2.easeOut})
      TweenMax.to(leaf.position, Math.random() * (1.5 - 0.2) + 0.2, {x: leaf.x + Math.random() * (100 - (-100)) -100, y: leaf.y + Math.random() * (100 - (-100)) -100, ease: Power2.easeOut})      
    })
    this.score++
    this.scoreText.innerHTML = this.score
  }
  render () {
    this.renderer.render(this.stage)
  }
}
