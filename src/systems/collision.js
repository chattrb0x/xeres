import { Enemy, Collidable, Health, Position, ScreenPosition, TakesInput, Velocity, Projectile, Mass, Force } from '../component.js'
import { Query } from '../query.js'
import { Vector2 } from '../vector.js'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../screen.js'

// Helper function to handle correct positive modulo
const positiveMod = (n, m) => ((n % m) + m) % m

const perRow = 4
// 20x15 cell
const gridSize = {
  h: SCREEN_HEIGHT / (perRow * perRow),
  w: SCREEN_WIDTH / (perRow * perRow)
}

function getGridCellIndex({ x, y }) {
  const spacing = perRow * perRow
  const xi = Math.floor(x / spacing)
  const yi = Math.floor(y / spacing)
  return xi * perRow + yi
}

function trackParticle(allPos) {
  const numObjects = allPos.length
  const spacing = perRow * perRow
  const cellSize = Math.ceil(Math.sqrt(SCREEN_WIDTH * SCREEN_HEIGHT / (spacing * spacing)))
  
  // make array to track pos hashes
  let cellCount = makeCellCount({ h: perRow, w: perRow })
  let allEntries = new Array(numObjects).fill(0)
  
  // Count particles per cell
  allPos.forEach(entityPos => {
    const i = hashPos(entityPos.vector.x, entityPos.vector.y, perRow)
    cellCount[i]++   
  })
  
  // Create prefix sum
  for (let i = 1; i < cellCount.length; i++) {
    cellCount[i] += cellCount[i - 1]
  }
  
  // Place particles into sorted order
  for (let i = numObjects - 1; i >= 0; i--) {
    const pos = allPos[i]
    const h = hashPos(pos.vector.x, pos.vector.y, perRow)
    cellCount[h]--
    allEntries[cellCount[h]] = i
  }
  
  return { cellCount, allEntries }
}

function makeCellCount({ h, w }) {
  return new Array(h * w + 1).fill(0)
}

let particleMap = []

function intCoord(coord, spacing) {
  return Math.floor(coord / spacing)
}

function hashPos(x, y, spacing) {
  return positiveMod(
    hashCoords(intCoord(x, spacing), intCoord(y, spacing)),
    spacing * spacing
  )
}

function hashCoords(xi, yi) {
  const hash = (xi * 92837111) ^ (yi * 689287499)
  return Math.abs(hash)
}


function groupByWorldPos(list, entitiesByWorldPos) {
  for (const { components, entity } of list) {
    const screen = components.get(ScreenPosition);
    if (!screen || !screen.worldPos) continue;

    (entitiesByWorldPos[screen.worldPos] ??= []).push({ entity, components });
  }
}


class CollisionSystem {
  static setup(level) {
    this.eventBus = level.eventBus
    
    this.eventBus.on('player:collision', CollisionSystem.onResolveCollision.bind(this))
  }
  static update(level, dt) {
    const enemies = Query.findAll(level, [Enemy, Collidable, Health, Position, ScreenPosition]);
    const players = Query.findAll(level, [Collidable, Health, Position, ScreenPosition, TakesInput]);
    const projectiles = Query.findAll(level, [Projectile, Position, ScreenPosition, Collidable]); // example

    const entitiesByWorldPos = {};

    groupByWorldPos(enemies, entitiesByWorldPos);
    groupByWorldPos(players, entitiesByWorldPos);
    groupByWorldPos(projectiles, entitiesByWorldPos);
    
    const hasCollision = {}
    Object.entries(entitiesByWorldPos).forEach(([worldPos, entities]) => {
      hasCollision[worldPos] = entities.length > 1 ? entities : []
    })
    
    // screenGroups with more than one Collidable
    Object.values(hasCollision).forEach(entities => {
      if (entities.length < 2) return
      
      // ignore collisions if no player involved
      const hasPlayerTag = entities.filter(body => body.components.get(TakesInput))
      if (hasPlayerTag.length < 1) return
      
      // Extract positions for spatial hashing
      const allPos = entities.map(body => body.components.get(Position))
    
      // Use spatial hashing to organize particles
      const { cellCount, allEntries } = trackParticle(allPos)
      
      for (let i = 0; i < entities.length; i++) {
        const bodyA = entities[i]
        const posA = bodyA.components.get(Position)
        const cellHash = hashPos(posA.vector.x, posA.vector.y, perRow)
        const startIdx = cellHash > 0 ? cellCount[cellHash - 1] : 0
        const endIdx = cellCount[cellHash]
   
        // Check against all entities in the same cell
        for (let j = startIdx; j < endIdx; j++) {
          const entityIdx = allEntries[j]
          if (entityIdx <= i) continue // Avoid duplicate checks
          
          const bodyB = entities[entityIdx]
          
          // ignore collisions between enemies
          // const [enA, enB] = [bodyA.components.get(TakesInput), bodyB.components.get(Enemy)]
          // console.log([enA, enB?.constructor.name])
          // if (!enA && enB?.constructor.name == "Enemy") continue
          // TODO: Ignore collisions between entities of the same type. 

          const posB = bodyB.components.get(Position)
          const collidableA = bodyA.components.get(Collidable)
          const collidableB = bodyB.components.get(Collidable)
                    
          // Calculate distance between entities
          const delta = posB.vector.clone().subtract(posA.vector.clone())
          const distanceSquared = delta.clone().dot(delta.clone())
          const minDistance = collidableA.radius + collidableB.radius
         
          // Check if collision occurred
          if (distanceSquared < minDistance * minDistance) {
            console.log("@@@@@@@@@@ collision detected")
            this.eventBus.emit('player:collision', {
              bodyA, 
              bodyB, 
              delta, 
              distance: Math.sqrt(distanceSquared)
            })
          }
        }
      }
    })
  }
  
  static onResolveCollision({ bodyA, bodyB, delta, distance }) {
    // console.log(distance)
    this.eventBus.emit("player:health", { entities: [bodyA, bodyB] })
    const posA = bodyA.components.get(Position)
    const posB = bodyB.components.get(Position)
    const collidableA = bodyA.components.get(Collidable)
    const collidableB = bodyB.components.get(Collidable)
    
    // Normalize collision vector
    const nx = delta.x / distance
    const ny = delta.y / distance
    
    // Separate overlapping bodies
    const overlap = collidableA.radius + collidableB.radius - distance
    const separation = new Vector2(nx * overlap * 0.5, ny * overlap * 0.5)
    posA.vector = posA.vector.clone().subtract(separation)
    posB.vector = posB.vector.clone().add(separation)
    
    // Apply velocity changes if Velocity component exists
    const velA = bodyA.components.get(Velocity)
    const velB = bodyB.components.get(Velocity)
    
    if (velA?.vector && velB?.vector) {
      // Calculate relative velocity
      const rvx = velB.vector.x - velA.vector.x
      const rvy = velB.vector.y - velA.vector.y
      const velocityAlongNormal = rvx * nx + rvy * ny
      
      // Don't resolve if velocities are separating
      if (velocityAlongNormal < 0) {
        const restitution = Math.min(collidableA.restitution || 0.8, collidableB.restitution || 0.8)
        const impulse = -(1 + restitution) * velocityAlongNormal / 2
        const impulseV = new Vector2(impulse * nx, impulse * ny)
        velA.vector = velA.vector.clone().subtract(impulseV)
        velB.vector = velB.vector.clone().add(impulseV)
      }
    }
    
  }
}
export { CollisionSystem, hashPos }