import { Position, ScreenPosition, Velocity, Mass, Force } from '../component.js'
import { Query } from '../query.js'
import { Vector2 } from '../vector.js'

const MAX_SPEED = 0.45

class PhysicsSystem {
  static update(level, dt) {
    const bodies = Query.findAll(level, [Force, Mass, Position, ScreenPosition, Velocity])
    
    for (const body of bodies) {
      
      // Apply forces
      const force = body.components.get(Force)
      const mass = body.components.get(Mass)
      const gravity = new Vector2(0, 0) // new Vector2(0, 0.0001)
      const gravityForce = gravity.clone().scale(mass.mass)
      force.vector.add(gravityForce)  
   
      if (body.mass <= 0) continue // skip immovable bodies
      const pos = body.components.get(Position)
      const vel = body.components.get(Velocity)
      // console.log("@@@@ Starting Values", pos, vel, mass, force)
      const acceleration = force.vector.clone().scale(1 / mass.mass)
      
      // TODO: Give different types of entities different max speeds.
      vel.vector.add(acceleration.clone().scale(dt))
      const speed = Math.sqrt(vel.vector.x*vel.vector.x + vel.vector.y*vel.vector.y)
      if (speed > MAX_SPEED) {
        vel.vector.scale(MAX_SPEED / speed)
      }
      
      pos.vector.add(vel.vector.clone().scale(dt))
      force.vector = new Vector2(0, 0)
      // console.log("@@@@ After Update", pos, vel, mass, force)
    } 
  }
}

export { PhysicsSystem }