import { Follows, Position, ScreenPosition, TakesInput } from '../component.js'
import { Query } from '../query.js'

const SCREEN_CENTER_OFFSET_X = 100
const SCREEN_CENTER_OFFSET_Y = 100

class CameraSystem {
  static setup(level, player, width, height) {
    const cam = Query.find(level, [Follows]).components.get(Follows)
    cam.entity = player
    cam.w = width
    cam.h = height
  }
  static update(level, dt) {
    const camera = Query.find(level, [Follows, ScreenPosition])
    const player = Query.find(level, [Position, TakesInput])
      
    const pos = player.components.get(Position)
    const camPos = camera.components.get(ScreenPosition)
    
    // Update position based on entity
    camPos.x = pos.vector.x - SCREEN_CENTER_OFFSET_X
    camPos.y = pos.vector.y - SCREEN_CENTER_OFFSET_Y
  }
}

export { CameraSystem, SCREEN_CENTER_OFFSET_X, SCREEN_CENTER_OFFSET_Y }