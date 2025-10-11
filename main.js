import { Query } from './src/query.js'
import { Level } from './src/level.js'
import { BackgroundLayer, Follows, Health, Rotation, ScreenPosition, TakesInput, Velocity, Position, Mass, Force } from './src/component.js'
import { MovementSystem } from './src/systems/movement.js'
import { RotationSystem } from './src/systems/rotation.js'
import { LayerSystem } from './src/systems/layer.js'
import { CameraSystem } from './src/systems/camera.js'
import { InputSystem } from './src/systems/input.js'
import { Vector2 } from './src/vector.js'

// Setup main canvas
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

console.log('----------\n start \n ----------')

const FPS = 60
const FIXED_UPDATE_STEP_MS = 1000 / FPS
const ENTITIES = 300

let accumulator = 0
let lastTime = 0
let level = null

// Entity Archetypes
const PLAYER_ABILITIES = [Force, Health, Mass, Position, Rotation, ScreenPosition, TakesInput, Velocity]
const CAMERA_ABILITIES = [Follows, ScreenPosition]
const ENEMY_ABILITIES = [Force, Health, Mass, Position, Rotation, ScreenPosition, Velocity]
const VULCAN_ABILITIES = [Force, Health, Position, ScreenPosition, Velocity]
const MISSILE_ABILITIES = [Force, Health, Mass, Position, Rotation, ScreenPosition, Velocity]

function setup() {
  lastTime = performance.now()
  
  level = new Level()
  
  // Background grid
  const cols = 64
  const rows = 36
  for(let g = 0; g < cols * rows; g++) level.createEntity({ components: [Position, BackgroundLayer] })
  LayerSystem.setup(level)
  
  const player = level.createEntity({ components: PLAYER_ABILITIES })
  level.createEntity({ components: CAMERA_ABILITIES })
  for (let i=0; i < ENTITIES; i++) {
    level.createEntity({ components: ENEMY_ABILITIES })  
  }
  
  CameraSystem.setup(level, player, canvas.width, canvas.height)
  
  let entityRecord = Query.find(level, PLAYER_ABILITIES)
  const obj = entityRecord.components.get(Position)
  obj.vector = new Vector2(-100, -100)
}


function onUpdate(level, dt) {
  InputSystem.update(level, dt)

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
  ctx.strokeStyle = '#EEEEEE'
  ctx.stroke()
}
function drawVulcan(ctx, x, y) {
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(x, y, 3, 3)
}
function drawMissile(ctx, centerX, centerY, angle) {
  const cosTheta = Math.cos(angle)
  const sinTheta = Math.sin(angle)
  const p0 = { x: 0, y: -6 } // Tip (relative to center)
  const p1 = { x: -3, y: 3 }  // Left-ish point
  const p2 = { x: 3, y: 3 }   // Right-ish point
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
    i === 0 ? ctx.moveTo(finalX, finalY) : ctx.lineTo(finalX, finalY)
  } 
}
function drawBg(ctx, x, y) {
  ctx.fillStyle = '#DDDDDD'
  ctx.fillRect(x, y, 1, 1)
}
function onRender() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  
  const camera = Query.find(level, [Follows, ScreenPosition])
  const camPos = camera.components.get(ScreenPosition)
  ctx.translate(-camPos.x, -camPos.y)

  const bg = Query.findAll(level, [BackgroundLayer, Position])
  bg.forEach(entity => {
    const { components } = entity
    const pos = components.get(Position)
    drawBg(ctx, pos.x, pos.y)
  })
  
  // Query player position for rendering 
  const entityRecords = Query.findAll(level, [Position, Rotation])
  if (!entityRecords?.length) return
  // console.log(entityRecords.length)
  entityRecords.forEach(entity => {
    const { components } = entity
    const pos = components.get(Position)
    const rot = components.get(Rotation)
    // console.log(`Player position: (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`)
    drawTriangle(ctx, pos.vector.x, pos.vector.y, rot.angle) 
  })
  
  ctx.restore()
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
  