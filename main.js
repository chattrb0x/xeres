import { Query } from './src/query.js'
import { Level } from './src/level.js'
import { mortonEncode, mortonDecode } from './src/morton.js'
import { BackgroundLayer, Enemy, Follows, Health, Rotation, ScreenPosition, TakesInput, Timer, Velocity, Position, Mass, Force, MissileFired } from './src/component.js'
import { MovementSystem } from './src/systems/movement.js'
import { PhysicsSystem } from './src/systems/physics.js'
import { RotationSystem } from './src/systems/rotation.js'
import { LayerSystem } from './src/systems/layer.js'
import { CollisionSystem } from './src/systems/collision.js'
import { CameraSystem } from './src/systems/camera.js'
import { InputSystem, INPUT_MANAGER } from './src/systems/input.js'
import { EnemyScriptSystem } from './src/systems/enemyScript.js'
import { ProjectileSystem } from './src/systems/projectile.js'
import { HealthSystem } from './src/systems/health.js'
import { PLAYER_ABILITIES  } from './src/entities/player.js'
import { ENEMY_ABILITIES } from './src/entities/enemy.js'
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
  
  level = new Level
  
  InputSystem.setup(level)
  CollisionSystem.setup(level)
  
  // Background grid
  const cols = 64
  const rows = 36
  for(let g = 0; g < cols * rows; g++) level.createEntity([new Position(), new BackgroundLayer()])
  LayerSystem.setup(level)
  
  // Player 
  const player = level.createEntity(PLAYER_ABILITIES)
  level.createEntity(CAMERA_ABILITIES)
  
  // Initial Enemies
  let count = 0
  while (count < 10) {
    level.createEntity(ENEMY_ABILITIES)
    count++
  }
  
  HealthSystem.setup(level)
  ProjectileSystem.setup(level)
  CameraSystem.setup(level, player, canvas.width, canvas.height)
  
  console.log("- setup complete")
}

function onUpdate(level, dt) {
  InputSystem.update(level, dt)
  
  EnemyScriptSystem.update(level, dt)

  RotationSystem.update(level, dt)
  PhysicsSystem.update(level, dt)
  MovementSystem.update(level, dt)
  
  ProjectileSystem.update(level, dt)
  
  CollisionSystem.update(level, dt)
  
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
  const projectileRecords = Query.findAll(level, [Timer, Position])
  // console.log(projectileRecords.length)
  projectileRecords.forEach(entity => {
    const { components } = entity
    const pos = components.get(Position)
    const rot = components.get(Rotation)
    // console.log(`Projectile position: (${pos.vector.x}, ${pos.vector.y})`)
    if(rot) {
      drawMissile(
        ctx,
        pos.vector.x,
        pos.vector.y,
        rot.angle
      )
    } else {
      drawVulcan(ctx, pos.vector.x, pos.vector.y)
    }
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
// console.log("Morton Encoding Examples (8-bit):");
console.log("==================================");

setup()
loop(performance.now())
  