import { Follows, Position, ScreenPosition, TakesInput } from '../component.js'
import { Query } from '../query.js'

class CameraSystem {
  static update(level, dt) {
    const cameras = Query.find(level, [Follows, ScreenPosition])
    const camera = cameras[0]
    
    const entities = Query.find(level, [Position, TakesInput])
    const player = entities[0]
      
    const pos = player.components.get(Position)
    const camPos = camera.components.get(ScreenPosition)
    
    // Update position based on entity
    camPos.x = pos.vector.x
    camPos.y = pos.vector.y
  }
}

export { CameraSystem }