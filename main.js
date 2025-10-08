import { Query } from './src/query.js'
import { Level } from './src/level.js'
import { Health, TakesInput, Velocity, Position } from './src/component.js'
import { MovementSystem } from './src/systems/movement.js'

// Setup main canvas
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

console.log('----------\n start \n ----------')

/** utilities */
class InputManager {
  constructor() {
    this.keys = {}
    this.setup()
  }
  setup() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true
    })
    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false
    })
  }
  isKeyDown(key) {
    return this.keys[key] || false
  }
}
const inputManager = new InputManager()
 
const FPS = 60
const FIXED_UPDATE_STEP_MS = 1000 / FPS
let accumulator = 0
let lastTime = 0
let level = null

// Entity Archetypes
const PLAYER_ABILITIES = [Health, Position, TakesInput, Velocity]

function setup() {
  inputManager.setup()
  lastTime = performance.now()
  
  level = new Level()
  
  // Create Player
  const player = level.createEntity({ components: PLAYER_ABILITIES })
  
  console.log('---')
  
  const entityRecords = Query.findEntitiesIn(level, PLAYER_ABILITIES)
  if (!entityRecords?.length) return
  const v = entityRecords[0].components[Velocity]
  v.x = Math.random()
  v.y = Math.random()
}

function onUpdate(level) {
  // InputSystem.update(level, inputManager)
  MovementSystem.update(level)
}

function drawTriangle(ctx, x, y) {
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x - 5, y + 11)
  ctx.lineTo(x + 5, y + 11)
  ctx.closePath()
  ctx.fill()  
}

function onRender() {
  // Query player position for rendering
  const entityRecords = Query.findEntitiesIn(level, PLAYER_ABILITIES)
  if (!entityRecords?.length) return
  
  const { components } = entityRecords[0]
  const pos = components[Position]
  // console.log(`Player position: (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`)
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  drawTriangle(ctx, pos.x, pos.y)
}

function loop(currentTime) {
 let frameTime = currentTime - lastTime
  lastTime = currentTime
  if(frameTime > 100) frameTime = 100
 
  accumulator += frameTime
  while(accumulator >= FIXED_UPDATE_STEP_MS) {
    onUpdate(level)
    accumulator -= FIXED_UPDATE_STEP_MS
  }
   
  onRender()
  window.requestAnimationFrame(loop)
}

setup()
loop(performance.now())
  