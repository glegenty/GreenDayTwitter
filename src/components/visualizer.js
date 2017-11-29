import * as PIXI from 'pixi.js'
import {TweenMax, Power2, TimelineLite, TweenLite} from "gsap";

export default class Visualizer {
  constructor(opts) {
    opts = opts || {}
    this.resolution = opts.resolution || 10
    this.cW = window.innerWidth
    this.cH = window.innerHeight
    this.positions = []
    
    this.particles = new PIXI.particles.ParticleContainer(100000)
    this.texture = PIXI.loader.resources['part'].texture
    console.log(this.texture)
    this.renderer = PIXI.autoDetectRenderer(this.cW, this.cH, {antialias: false, transparent: true, resolution: 1})
    this.stage = new PIXI.Container()
    this.init()
  }

  init () {
    document.querySelector('.pixi-output').appendChild(this.renderer.view)
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
    this.changeText('GreenDay')
  }
  getTextPosition () {
    const imageData = this.wordCtx.getImageData(0, 0, this.cW, this.cH)
    let i = 0
    let index = 0
    for (let x = 0; x < imageData.width; x += this.resolution) {
      for (let y = 0; y < imageData.height; y += this.resolution) {
        let i = (y * imageData.width + x) * 4;
        if (imageData.data[i + 3] > 128) {
          if (index >= this.positions.length) {
            this.positions[index] = new PIXI.Sprite(this.texture)
            this.positions[index].x = x
            this.positions[index].y = y
            this.positions[index].rotation = Math.random()
            this.positions[index].alpha = Math.random() * (1 - 0.2) + 0.2         
            this.positions[index].tint = Math.random() > 0.5 ? 0x43e97b : 0x38f9d7
            this.positions[index].scale.set(0.2)
            this.particles.addChild(this.positions[index])
            
            // console.log(1)
 
          } else {
            // this.positions[index].x = x;
            // this.positions[index].y = y;
            this.positions[index].alpha = Math.random() * (1 - 0.2) + 0.2         
            TweenMax.to(this.positions[index], Math.random() * (1 - 0.2) + 0.2, {x: x, y: y, ease: Power2.easeOut})      
      
            // console.log(2)
          }
          index++;
        }
      }
    }
    console.log(this.positions.length - index > 0)
    let toDestroy = this.positions.slice(index, this.positions.length);
    toDestroy.forEach((element) => element.destroy())
    this.positions.splice(index, this.positions.length - index);
    
    this.positions.length - index > 0 && this.particles.removeChildren(this.positions.length - index, this.positions.length)
    
  }
  changeText (tweet) {
    let text = this.formatText(tweet)
    this.wordCtx.clearRect(0, 0, this.cW, this.cH)
    this.wordCtx.font = '250px serif'
    this.wordCtx.textAlign = 'center'
    this.wordCtx.fillText(text, this.cW/2, this.cH/2)
    this.getTextPosition()
    console.log(this.positions)
    
  }

  formatText (tweet) {
    let text = tweet.replace(/#(\S*)/g, '')
    return text
  }
  initDebug () {
    const btn = document.querySelector('.btn-changeText')
    const input = document.querySelector('.debugText')
    console.log(btn)
    
    btn.addEventListener('click', () => {
      this.changeText(input.value)
    })
    this.wordCanvas.addEventListener('click', () => {
      console.log('Explode')
      
      this.explode()
    })

  }

  explode () {
    this.positions.forEach((leaf) => {
      TweenMax.to(leaf.scale, Math.random() * (1 - 0.2) + 0.2, {x: 0, y: 0})      
      TweenMax.to(leaf.position, Math.random() * (1 - 0.2) + 0.2, {x: leaf.x + Math.random() * (100 - (-100)) -100, y: leaf.y + Math.random() * (100 - (-100)) -100, ease: Power2.easeOut})      
    })
  }
  render () {
    this.renderer.render(this.stage)
  }
}
