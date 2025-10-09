import { Follows, Position, TakesInput } from '../component.js'
import { Query } from '../query.js'

class CameraSystem {
  static update(level, dt) {
    const camera = Query.findEntitiesIn(level, [Follows])
    const entities = Query.findEntitiesIn(level, [Position, TakesInput])
    const player = entities[0]
      
    const pos = player.components[Position]
    const camPos = camera.components[Position]
    
    // Update position based on entity
    camePos.x = pos.x
    camePos.y = pos.y
  }
}

export { CameraSystem }