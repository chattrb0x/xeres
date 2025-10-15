import { Query } from './src/query.js'
import { Level } from './src/level.js'
import { BackgroundLayer, Follows, Health, Rotation, ScreenPosition, TakesInput, Velocity, Position, Mass, Force, MissileFired } from './src/component.js'
import { MovementSystem } from './src/systems/movement.js'
import { RotationSystem } from './src/systems/rotation.js'
import { LayerSystem } from './src/systems/layer.js'
import { CameraSystem } from './src/systems/camera.js'
import { InputSystem, INPUT_MANAGER } from './src/systems/input.js'
import { ENEMY_ABILITIES, EnemySpawnerSystem } from './src/systems/enemySpawner.js'
import { Vector2 } from './src/vector.js'
import { MISSILE_ABILITIES, MissileSpawnerSystem } from './src/systems/missileSpawner.js'
import { PLAYER_ABILITIES  } from './src/player.js'


// Setup main canvas
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

INPUT_MANAGER.setup(canvas)

console.log('----------\n start \n ----------')

const FPS = 60
const FIXED_UPDATE_STEP_MS = 1000 / FPS
const ENTITIES = 300

// TODO: This is probably bad, 
// but needed to get the character not in the top-left corner
const SCREEN_CENTER_OFFSET_X = 100
const SCREEN_CENTER_OFFSET_Y = 100

let accumulator = 0
let lastTime = 0
let level = null

// Entity Archetypes
const CAMERA_ABILITIES = [new Follows(), new ScreenPosition()]
const VULCAN_ABILITIES = [new Force(), new Health(1000), new Position(), new ScreenPosition(), new Velocity()]

function setup() {
  lastTime = performance.now()
  
  level = new Level()
  
  // Background grid
  const cols = 64
  const rows = 36
  for(let g = 0; g < cols * rows; g++) level.createEntity([new Position(), new BackgroundLayer()])
  LayerSystem.setup(level)
  
  const player = level.createEntity(PLAYER_ABILITIES)
  level.createEntity(CAMERA_ABILITIES)
  
  CameraSystem.setup(level, player, canvas.width, canvas.height)
}


function onUpdate(level, dt) {
  InputSystem.update(level, dt)

  RotationSystem.update(level, dt)
  MovementSystem.update(level, dt)
  MissileSpawnerSystem.update(level, dt)
  EnemySpawnerSystem.update(level, dt)

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
    // console.log(`Player position: (${pos.vector.x}, ${pos.vector.y})`)
    drawTriangle(
      ctx,
      // TODO: Make the player coordinate the center of the screen.
      // Currently it's the topleft corner 
      pos.vector.x + SCREEN_CENTER_OFFSET_X,
      pos.vector.y + SCREEN_CENTER_OFFSET_Y,
      rot.angle
    ) 
  })
  
  // Query player position for rendering 
  const missileRecords = Query.findAll(level, MISSILE_ABILITIES)
  // console.log(entityRecords.length)
  missileRecords.forEach(entity => {
    const { components } = entity
    const pos = components.get(Position)
    const rot = components.get(Rotation)
    // console.log(`Player position: (${pos.vector.x}, ${pos.vector.y})`)
    drawMissile(
      ctx,
      // TODO: Make the player coordinate the center of the screen.
      // Currently it's the topleft corner 
      pos.vector.x + SCREEN_CENTER_OFFSET_X,
      pos.vector.y + SCREEN_CENTER_OFFSET_Y,
      rot.angle
    ) 
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
  