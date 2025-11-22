import { Query } from './src/query.js'
import { Level } from './src/level.js'
import * as c from './src/component.js'
import * as sys from './src/systems'
import { PLAYER_ABILITIES  } from './src/entities/player.js'
import { ENEMY_ABILITIES } from './src/entities/enemy.js'
import { onRender } from './render.js'

import eruda from 'eruda'
eruda.init()

// Setup main canvas
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

console.log('----------\n start \n ----------')

const FPS = 60
const FIXED_UPDATE_STEP_MS = 1000 / FPS

let accumulator = 0
let lastTime = 0
let level = null

// Entity Archetypes
const CAMERA_ABILITIES = [new c.Follows(), new c.ScreenPosition()]

function setup() {
  lastTime = performance.now()
  
  level = new Level
  
  sys.InputSystem.setup(level, canvas)
  sys.CollisionSystem.setup(level)
  
  // Background grid
  const cols = 64
  const rows = 36
  for(let g = 0; g < cols * rows; g++) level.createEntity([new c.Position(), new c.BackgroundLayer()])
  sys.LayerSystem.setup(level)
  
  // Player 
  const player = level.createEntity(PLAYER_ABILITIES)
  level.createEntity(CAMERA_ABILITIES)
  
  // Initial Enemies
  let count = 0
  while (count < 10) {
    level.createEntity(ENEMY_ABILITIES)
    count++
  }
  
  sys.HealthSystem.setup(level)
  sys.ProjectileSystem.setup(level)
  sys.CameraSystem.setup(level, player, canvas.width, canvas.height)
  
  console.log("- setup complete")
}

function onUpdate(level, dt) {
  sys.InputSystem.update(level, dt)
  
  sys.EnemyScriptSystem.update(level, dt)

  sys.RotationSystem.update(level, dt)
  sys.PhysicsSystem.update(level, dt)
  sys.MovementSystem.update(level, dt)
  
  sys.ProjectileSystem.update(level, dt)
  
  sys.CollisionSystem.update(level, dt)
  
  // Moves camera based on player pos so must come last
  sys.CameraSystem.update(level, dt)
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
   
  onRender(ctx, canvas, level)
  window.requestAnimationFrame(loop)
}


// Example usage and testing
// console.log("Morton Encoding Examples (8-bit):");
console.log("==================================");

setup()
loop(performance.now())
