import { Follows, Position, ScreenPosition, TakesInput } from '../component.js'
import { Query } from '../query.js'

class CameraSystem {
  static update(level, dt) {
    const camera = Query.find(level, [Follows, ScreenPosition])
    const player = Query.find(level, [Position, TakesInput])
      
    const pos = player.components.get(Position)
    const camPos = camera.components.get(ScreenPosition)
    
    // Update position based on entity
    camPos.x = pos.vector.x
    camPos.y = pos.vector.y
  }
}

export { CameraSystem }