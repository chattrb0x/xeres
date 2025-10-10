import { Query } from './src/query.js'
import { Level } from './src/level.js'
import { BackgroundLayer, Follows, Health, Rotation, TakesInput, Velocity, Position, Mass, Force } from './src/component.js'
import { MovementSystem } from './src/systems/movement.js'
import { RotationSystem } from './src/systems/rotation.js'
import { LayerSystem } from './src/systems/layer.js'
import { CameraSystem } from './src/systems/camera.js'

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
const ENTITIES = 300

let accumulator = 0
let lastTime = 0
let level = null

// Entity Archetypes
const PLAYER_ABILITIES = [Force, Health, Mass, Position, Rotation, TakesInput, Velocity]
const CAMERA_ABILITIES = [Follows, Position]
const ENEMY_ABILITIES = [Force, Health, Mass, Position, Rotation, Velocity]

function setup() {
  inputManager.setup()
  lastTime = performance.now()
  
  level = new Level()
  
  // Background grid
  const cols = 64
  const rows = 36
  for(let g = 0; g < cols * rows; g++) level.createEntity({ components: [Position, BackgroundLayer] })
  LayerSystem.setup(level)
  
  // Create Player
  const player = level.createEntity({ components: PLAYER_ABILITIES })
  const camera = level.createEntity({ components: CAMERA_ABILITIES })
  for (let i=0; i < ENTITIES; i++) {
    level.createEntity({ components: ENEMY_ABILITIES })  
  }
  console.log('setup')
  console.log('---')
  
  let entityRecords = Query.findEntitiesIn(level, CAMERA_ABILITIES)
  // console.log(entityRecords.length)
  const cam = entityRecords[0].components.get(Follows)
  cam.entity = player
  cam.w = canvas.width
  cam.h = canvas.height
}

let bouncex = {}
let bouncey = {}

function onUpdate(level, dt) {
  // InputSystem.update(level, inputManager)
  
  // TODO: un remove? 
  // TODO: remove
  // - Hack in some velocity to kick off the movement system
  // const entityRecords = Query.findEntitiesIn(level, [Position, Velocity])
  // if (entityRecords.length < 1) return
  // entityRecords.forEach(entity => {
  //   const v = entity.components.get(Velocity)
  //   const pos = entity.components.get(Position)
  //   if(!bouncex[entity.id]) bouncex[entity.id] = false
  //   if(!bouncey[entity.id]) bouncey[entity.id] = false
  //   if(pos?.x >= canvas.width) bouncex[entity.id] = true
  //   if(pos?.y >= canvas.height) bouncey[entity.id] = true
  //   if(pos.x <= 0) bouncex[entity.id] = false
  //   if(pos.y <= 0) bouncey[entity.id] = false
  //   v.dx = Math.random() * 50 * (bouncex[entity.id] == true ? -1 * 7 : 7)
  //   v.dy = Math.random() * 50 * (bouncey[entity.id] == true ? -1 * 7 : 7)
  // })

  RotationSystem.update(level, dt)
  MovementSystem.update(level, dt)
  
  // Moves camera based on player pos so must come last
  CameraSystem.update(level, dt)
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
  ctx.strokeStyle = 'white'
  ctx.stroke()
}
function drawBg(ctx, x, y) {
  ctx.fillStyle = '#DDDDDD'
  ctx.fillRect(x, y, 1, 1)
}
function onRender() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  const bg = Query.findEntitiesIn(level, [BackgroundLayer, Position])
  bg.forEach(entity => {
    const { components } = entity
    const pos = components.get(Position)
    drawBg(ctx, pos.x, pos.y)
  })
  
  // Query player position for rendering 
  const entityRecords = Query.findEntitiesIn(level, [Position, Rotation])
  if (!entityRecords?.length) return
  // console.log(entityRecords.length)
  entityRecords.forEach(entity => {
    const { components } = entity
    const pos = components.get(Position)
    const rot = components.get(Rotation)
    // console.log(`Player position: (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`)
  
    drawTriangle(ctx, pos.vector.x, pos.vector.y, rot.angle) 
  })
}


function loop(currentTime) {
  let frameTime = currentTime - lastTime
  lastTime = currentTime
  if(frameTime > 100) frameTime = 100
 
  accumulator += frameTime
  while(accumulator >= FIXED_UPDATE_STEP_MS) {
    onUpdate(level, FIXED_UPDATE_STEP_MS)
    accumulator -= FIXED_UPDATE_STEP_MS
  }
   
  onRender()
  window.requestAnimationFrame(loop)
}

setup()
loop(performance.now())
  