import { Query } from './src/query.js'
import { Level } from './src/level.js'
import { mortonEncode, mortonDecode } from './src/morton.js'
import { BackgroundLayer, Enemy, Follows, Health, Rotation, ScreenPosition, TakesInput, Timer, Velocity, Position, Mass, Force, MissileFired } from './src/component.js'
import { MovementSystem } from './src/systems/movement.js'
import { PhysicsSystem } from './src/systems/physics.js'
import { RotationSystem } from './src/systems/rotation.js'
import { LayerSystem } from './src/systems/layer.js'
import { CameraSystem } from './src/systems/camera.js'
import { InputSystem, INPUT_MANAGER } from './src/systems/input.js'
import { EnemySpawnerSystem } from './src/systems/enemySpawner.js'
import { EnemyScriptSystem } from './src/systems/enemyScript.js'
import { MissileSpawnerSystem } from './src/systems/missileSpawner.js'
import { PLAYER_ABILITIES  } from './src/player.js'
import { drawTriangle, drawBg, drawVulcan, drawMissile } from './draw.js'

// Setup main canvas
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

INPUT_MANAGER.setup(canvas)

console.log('----------\n start \n ----------')

const FPS = 60
const FIXED_UPDATE_STEP_MS = 1000 / FPS

let accumulator = 0
let lastTime = 0
let level = null

// Entity Archetypes
const CAMERA_ABILITIES = [new Follows(), new ScreenPosition()]

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
  
  EnemySpawnerSystem.setup(level)
  
  CameraSystem.setup(level, player, canvas.width, canvas.height)
}

function onUpdate(level, dt) {
  InputSystem.update(level, dt)
  
  EnemyScriptSystem.update(level, dt)

  RotationSystem.update(level, dt)
  PhysicsSystem.update(level, dt)
  MovementSystem.update(level, dt)
  
  MissileSpawnerSystem.update(level, dt)

  // Moves camera based on player pos so must come last
  CameraSystem.update(level, dt)
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
  let entityRecords = Query.findAll(level, [TakesInput, Position, Rotation])
  if (!entityRecords?.length) return
  // console.log(entityRecords.length)
  entityRecords.forEach(entity => {
    const { components } = entity
    const pos = components.get(Position)
    const rot = components.get(Rotation)
    // console.log(`Player position: (${pos.vector.x}, ${pos.vector.y})`)
    drawTriangle(
      ctx,
      pos.vector.x,
      pos.vector.y,
      rot.angle
    ) 
  })
  // Baddies
  entityRecords = Query.findAll(level, [Enemy, Position, Rotation])
  if (!entityRecords?.length) return
  // console.log(entityRecords.length)
  entityRecords.forEach(entity => {
    const { components } = entity
    const pos = components.get(Position)
    const rot = components.get(Rotation)
    // console.log(`Player position: (${pos.vector.x}, ${pos.vector.y})`)
    drawTriangle(
      ctx,
      pos.vector.x,
      pos.vector.y,
      rot.angle, 2
    ) 
  }) 
  // Query player position for rendering 
  const missileRecords = Query.findAll(level, [Timer, Position, Rotation])
  // console.log(entityRecords.length)
  missileRecords.forEach(entity => {
    const { components } = entity
    const pos = components.get(Position)
    const rot = components.get(Rotation)
    // console.log(`Player position: (${pos.vector.x}, ${pos.vector.y})`)
    drawMissile(
      ctx,
      pos.vector.x,
      pos.vector.y,
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



// Example usage and testing
console.log("Morton Encoding Examples (8-bit):");
console.log("==================================");

const testCases = [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: -1, y: -1 },
    { x: 127, y: 127 },
    { x: -127, y: -127 }
]

testCases.forEach(({ x, y }) => {
   const encoded = mortonEncode(x, y);
   const decoded = mortonDecode(encoded);
    console.log(`(${x}, ${y}) -> 0x${encoded.toString(16).padStart(4, '0')} -> (${decoded.x}, ${decoded.y})`);
})

setup()
loop(performance.now())
  