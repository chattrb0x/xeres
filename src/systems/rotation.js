import { Rotation } from '../component.js'
import { Query } from '../query.js'

class RotationSystem {
  static update(level, dt) {
    Query.find(level, [Rotation])?.forEach(({ components }) => {
      const rot = components.get(Rotation)
      rot.angle += rot.rotationSpeed * dt
    })    
  }
}

export { RotationSystem }