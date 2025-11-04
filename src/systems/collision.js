import { Collidable, Position, ScreenPosition, Velocity, Mass, Force } from '../component.js'
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
  let cellCount = new Array(cellSize).fill(0)
  let allEntries = new Array(numObjects).fill(0)
  
  // Count particles per cell
  allPos.forEach(entityPos => {
    const i = hashPos(entityPos.x, entityPos.y, spacing)
    cellCount[i]++   
  })
  
  // Create prefix sum
  for (let i = 1; i < cellCount.length; i++) {
    cellCount[i] += cellCount[i - 1]
  }
  
  // Place particles into sorted order
  for (let i = numObjects - 1; i >= 0; i--) {
    const pos = allPos[i]
    const h = hashPos(pos.x, pos.y, spacing)
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

class CollisionSystem {
  static update(level, dt) {
    const bodies = Query.findAll(level, [Collidable, Position, ScreenPosition])
    
    const hasWorldPos = bodies.filter(({ entity, components }) => {
      return components.get(ScreenPosition)
    })
    
    const entitiesByWorldPos = {}
    for (const body of hasWorldPos) {
      const screen = body.components.get(ScreenPosition)
      if(!screen.worldPos) continue
      if(!entitiesByWorldPos[screen.worldPos]) entitiesByWorldPos[screen.worldPos] = []
      entitiesByWorldPos[screen.worldPos].push(body)
    }
    
    const hasCollision = {}
    Object.entries(entitiesByWorldPos).forEach(([worldPos, entities]) => {
      if(entities.length > 1) {
        hasCollision[worldPos] = entities
      } else {
        hasCollision[worldPos] = []
      }
    })
    
    // screenGroups with more than one Collidable
    Object.values(hasCollision).forEach(entities => {
      if (entities.length < 2) return
      
      // Extract positions for spatial hashing
      const allPos = entities.map(body => {
        return body.components.get(Position)
      })
    
      // Use spatial hashing to organize particles
      const { cellCount, allEntries } = trackParticle(allPos)
      const spacing = perRow * perRow
      
      // Build a map of hash -> entity indices for quick lookup
      const cellMap = {}
      for (let i = 0; i < entities.length; i++) {
        const pos = allPos[i]
        const cellHash = hashPos(pos.x, pos.y, spacing)
        if (!cellMap[cellHash]) cellMap[cellHash] = []
        cellMap[cellHash].push(i)
      }
      
      // Check collisions - only check entities in the same spatial hash cell
      Object.values(cellMap).forEach(indicesInCell => {
        if (indicesInCell.length < 2) return
        
        // Check all pairs within this cell
        for (let i = 0; i < indicesInCell.length; i++) {
          for (let j = i + 1; j < indicesInCell.length; j++) {
            const idxA = indicesInCell[i]
            const idxB = indicesInCell[j]
            
            const bodyA = entities[idxA]
            const bodyB = entities[idxB]
            const posA = bodyA.components.get(Position)
            const posB = bodyB.components.get(Position)
            const collidableA = bodyA.components.get(Collidable)
            const collidableB = bodyB.components.get(Collidable)
            
            // Calculate distance between entities
            const dx = posB.vector.x - posA.vector.x
            const dy = posB.vector.y - posA.vector.y
            const distanceSquared = dx * dx + dy * dy
            const minDistance = collidableA.radius + collidableB.radius
            
            // Check if collision occurred
            if (distanceSquared < minDistance * minDistance && distanceSquared > 0) {
              CollisionSystem.resolveCollision(bodyA, bodyB, dx, dy, Math.sqrt(distanceSquared))
            }
          }
        }
      })
    })
  }
  
  static resolveCollision(bodyA, bodyB, dx, dy, distance) {
    const posA = bodyA.components.get(Position)
    const posB = bodyB.components.get(Position)
    const collidableA = bodyA.components.get(Collidable)
    const collidableB = bodyB.components.get(Collidable)
    
    // Normalize collision vector
    const nx = dx / distance
    const ny = dy / distance
    
    // Separate overlapping bodies
    const overlap = collidableA.radius + collidableB.radius - distance
    const separationX = nx * overlap * 0.5
    const separationY = ny * overlap * 0.5
    
    posA.vector.x -= separationX
    posA.vector.y -= separationY
    posB.vector.x += separationX
    posB.vector.y += separationY
    
    // Apply velocity changes if Velocity component exists
    const velA = bodyA.components.get(Velocity)
    const velB = bodyB.components.get(Velocity)
    
    if (velA && velB) {
      // Calculate relative velocity
      const rvx = velB.vector.x - velB.vector.x
      const rvy = velB.vector.y - velA.vector.y
      const velocityAlongNormal = rvx * nx + rvy * ny
      
      // Don't resolve if velocities are separating
      if (velocityAlongNormal < 0) {
        const restitution = Math.min(collidableA.restitution || 0.8, collidableB.restitution || 0.8)
        const impulse = -(1 + restitution) * velocityAlongNormal / 2
        
        velA.vector.x -= impulse * nx
        velA.vector.y -= impulse * ny
        velB.vector.x += impulse * nx
        velB.vector.y += impulse * ny
      }
    }
  }
}
export { CollisionSystem, hashPos }