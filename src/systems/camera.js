import { Follows, Position, TakesInput } from '../component.js'
import { Query } from '../query.js'

class CameraSystem {
  static update(level, dt) {
    const cameras = Query.findEntitiesIn(level, [Follows, Position])
    const camera = cameras[0]
    
    const entities = Query.findEntitiesIn(level, [Position, TakesInput])
    const player = entities[0]
      
    const pos = player.components.get(Position)
    const camPos = camera.components.get(Position)
    
    // Update position based on entity
    camPos.x = pos.vector.x
    camPos.y = pos.vector.y
  }
}

export { CameraSystem }