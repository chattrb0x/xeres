import { Position, ScreenPosition, Velocity, Mass, Force } from '../component.js'
import { Query } from '../query.js'
import { Vector2 } from '../vector.js'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../screen.js'

const perRow = 4
const GRID_TOTAL_WIDTH = perRow * SCREEN_WIDTH
const GRID_TOTAL_HEIGHT = perRow * SCREEN_HEIGHT
/**
 * Calculates the local screen index (0-15) for a given world coordinate (x, y)
 * in a world composed of many tiled 4x4 grids.
 */
function getLocalScreenIndex({ x, y }, perRow = 4) {

    // --- 1. Calculate the size of the entire 4x4 grid in world units ---
    // --- 2. Calculate the local coordinates (relative to the grid's top-left) ---
    // The key here is the Modulo operation (%).

    // The floor division (Math.floor(Xw / TOTAL_WIDTH)) gives the coordinate of the
    // containing grid (e.g., Super-Chunk X).
    
    // The modulo operation gives the *offset* within that grid.
    // If coordinates can be negative, standard % can return a negative value, 
    // which breaks the local 0-based coordinate system. We must adjust the modulo result.

    // Calculate the local X coordinate (localX is always [0, GRID_TOTAL_WIDTH - 1])
    const localX = positiveMod(x, GRID_TOTAL_WIDTH)

    // Calculate the local Y coordinate (localY is always [0, GRID_TOTAL_HEIGHT - 1])
    // ASSUMPTION: World Y increases DOWNWARD (like screen space)
    const localY = positiveMod(y, GRID_TOTAL_HEIGHT)

    // --- 3. Calculate the column and row index (0 to 3) within the local grid ---

    // The logic from your original function now applies to the local coordinates.
    const colIndex = Math.floor(localX / SCREEN_WIDTH)
    const rowIndex = Math.floor(localY / SCREEN_HEIGHT)
    
    // NOTE: Because localX and localY are guaranteed to be positive and within
    // the [0, TOTAL_SIZE) range, clamping is technically not needed here, 
    // as colIndex and rowIndex will correctly be in the [0, 3] range.

    // --- 4. Combine to get the final 0-15 index (Row-Major Order) ---
    return (rowIndex * perRow) + colIndex;
}

// Helper function to handle correct positive modulo
const positiveMod = (n, m) => ((n % m) + m) % m

function getWorldPos({ x, y }) {
  const gridX = Math.floor(x / GRID_TOTAL_WIDTH)
  const gridY = Math.floor(y / GRID_TOTAL_HEIGHT)
  return `${[gridX, gridY].join(':')}`
}


class MovementSystem {
  static update(level, dt) {
    const bodies = Query.findAll(level, [Position, ScreenPosition])
    for (const body of bodies) {
      
      const screen = body.components.get(ScreenPosition)
      const pos = body.components.get(Position)
      
       // Track screen position
      screen.x = positiveMod(pos.vector.x, SCREEN_WIDTH)
      screen.y = positiveMod(pos.vector.y, SCREEN_HEIGHT)
      
      if(getWorldPos(pos.vector) !== screen.worldPos) {
        // console.log(getWorldPos(pos.vector))
      }
      screen.worldPos = getWorldPos(pos.vector)
      screen.screenIndex = getLocalScreenIndex(pos.vector)
    } 
  }
}

export { MovementSystem }