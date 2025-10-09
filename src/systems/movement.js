import { Position, Velocity } from '../component.js'
import { Query } from '../query.js'

class MovementSystem {
  static update(level, dt) {
    Query.findEntitiesIn(level, [Position, Velocity])?.forEach(({ components }) => {
      const pos = components.get(Position)
      const vel = components.get(Velocity)
      
      // Update position based on velocity
      pos.x += vel.dx * dt
      pos.y += vel.dy * dt
    })    
  }
}

export { MovementSystem }