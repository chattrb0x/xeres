import { Query } from './src/query.js'
import { Level } from './src/level.js'
import { Health, Rotation, TakesInput, Velocity, Position } from './src/component.js'
import { MovementSystem } from './src/systems/movement.js'
import { RotationSystem } from './src/systems/rotation.js'

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
const PLAYER_ABILITIES = [Health, Position, Rotation, TakesInput, Velocity]

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
  v.dx = Math.random()
  v.dy = Math.random()
}

let bouncex = false
let bouncey = false

function onUpdate(level, dt) {
  // InputSystem.update(level, inputManager)
  
  // TODO: remove
  // - Hack in some velocity to kick off the movement system
  const entityRecords = Query.findEntitiesIn(level, PLAYER_ABILITIES)
  if (!entityRecords?.length) return
  const v = entityRecords[0].components[Velocity]
  const pos = entityRecords[0].components[Position]
  
  if(pos.x >= canvas.width) bouncex = true
  if(pos.y >= canvas.height) bouncey = true
  if(pos.x < 0) bouncex = false
  if(pos.y < 0) bouncey = false
  
  v.dx = Math.random() * bouncex ? -1 * 70 : 70
  v.dy = Math.random() * bouncey ? -1 * 70 : 70
  // - Hack - END
  
  RotationSystem.update(level, dt)
  MovementSystem.update(level, dt) 
}

// TODO: remove
function drawTriangle(ctx, centerX, centerY, angle) {
  const cosTheta = Math.cos(angle)
  const sinTheta = Math.sin(angle)
  
  const p0 = { x: 0, y: -11 } // Tip (relative to center)
  const p1 = { x: -5, y: 5 }  // Left-ish point
  const p2 = { x: 5, y: 5 }   // Right-ish point
  const vertices = [p0, p1, p2]
  
  ctx.beginPath()
  
  // Iterate through the vertices, rotate them, and move them to the correct position (centerX, centerY)
  for (let i = 0; i < vertices.length; i++) {
    const p = vertices[i]
    const rotatedX = p.x * cosTheta - p.y * sinTheta
    const rotatedY = p.x * sinTheta + p.y * cosTheta
    
    // Final position: Rotated position + Center position
    const finalX = rotatedX + centerX
    const finalY = rotatedY + centerY
    
    if (i === 0) {
      ctx.moveTo(finalX, finalY)
    } else {
      ctx.lineTo(finalX, finalY)
    }
  }

  ctx.closePath()
  ctx.fill()
}

function onRender() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // Query player position for rendering
  const entityRecords = Query.findEntitiesIn(level, PLAYER_ABILITIES)
  if (!entityRecords?.length) return
  const { components } = entityRecords[0]
  const pos = components[Position]
  const rot = components[Rotation]
  // console.log(`Player position: (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`)
  
  drawTriangle(ctx, pos.x, pos.y, rot.angle)
}


function loop(currentTime) {
  let frameTime = currentTime - lastTime
  lastTime = currentTime
  if(frameTime > 100) frameTime = 100
 
  accumulator += frameTime
  while(accumulator >= FIXED_UPDATE_STEP_MS) {
    onUpdate(level, (1/FPS))
    accumulator -= FIXED_UPDATE_STEP_MS
  }
   
  onRender()
  window.requestAnimationFrame(loop)
}

setup()
loop(performance.now())
  