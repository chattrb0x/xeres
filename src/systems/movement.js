import { Position, Velocity, Mass, Force } from '../component.js'
import { Query } from '../query.js'
import { Vector2 } from '../vector.js'



class Physics {
  applyForces(bodies) {
    // TODO: Do something fancier than just downward gravity.
    for (const body of bodies) {
      const force = body.components.get(Force)
      const mass = body.components.get(Mass)
      const gravity = new Vector2(0, 0.0001)
      const gravityForce = gravity.clone().scale(mass.mass);
      force.vector.x = gravityForce.x
      force.vector.y = gravityForce.y
    }
  }

  update(bodies, dt) {
    this.applyForces(bodies)
    for (const body of bodies) {
      console.log(body)
      if (body.mass <= 0) continue; // skip immovable bodies
      const pos = body.components.get(Position)
      const vel = body.components.get(Velocity)
      const mass = body.components.get(Mass)
      const force = body.components.get(Force)
      console.log("@@@@ Starting Values", pos, vel, mass, force)
      const acceleration = force.vector.clone().scale(1 / mass.mass);
      vel.vector.add(acceleration.clone().scale(dt));
      pos.vector.add(vel.vector.clone().scale(dt));
      force.x = 0
      force.y = 0
      console.log("@@@@ After Update", pos, vel, mass, force)
    }
  }
}


class MovementSystem {
  static update(level, dt) {
    // TODO: Pass in the physics to apply
    const physics = new Physics()
    const bodies = Query.findEntitiesIn(level, [Position, Velocity, Mass, Force])
    physics.update(bodies, dt)
  }
}

export { MovementSystem }