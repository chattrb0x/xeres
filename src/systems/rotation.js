import { Rotation } from '../component.js'
import { Query } from '../query.js'

class RotationSystem {
  static update(level, dt) {
    Query.findEntitiesIn(level, [Rotation])?.forEach(({ components }) => {
      const rot = components[Rotation]
      rot.angle += rot.rotationSpeed
    })    
  }
}

export { RotationSystem }