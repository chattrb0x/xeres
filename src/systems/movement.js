import { Position, ScreenPosition, Velocity, Mass, Force } from '../component.js'
import { Query } from '../query.js'
import { Vector2 } from '../vector.js'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../screen.js'

function getScreenIndex({ x, y }, perRow = 4) {
  const colIndex = Math.floor(x / SCREEN_WIDTH)
  const rowIndex = Math.floor(y / SCREEN_HEIGHT)
  return (rowIndex * perRow) + colIndex
}

class Physics {
  applyForces(bodies) {
    // TODO: Do something fancier than just downward gravity.
    for (const body of bodies) {
      const force = body.components.get(Force)
      const mass = body.components.get(Mass)
      const gravity = new Vector2(0, 0) // new Vector2(0, 0.0001)
      const gravityForce = gravity.clone().scale(mass.mass)
      force.vector.add(gravityForce)  
    }
  }

  update(bodies, dt) {
    this.applyForces(bodies)
    for (const body of bodies) {
      if (body.mass <= 0) continue // skip immovable bodies
      const pos = body.components.get(Position)
      const screen = body.components.get(ScreenPosition)
      const vel = body.components.get(Velocity)
      const mass = body.components.get(Mass)
      const force = body.components.get(Force)
      // console.log("@@@@ Starting Values", pos, vel, mass, force)
      const acceleration = force.vector.clone().scale(1 / mass.mass)
      vel.vector.add(acceleration.clone().scale(dt))
      pos.vector.add(vel.vector.clone().scale(dt))
      force.vector = new Vector2(0, 0)
      // console.log("@@@@ After Update", pos, vel, mass, force)
      
      // TODO: break out to its own system
      // Track screen position
      screen.x = pos.vector.x % SCREEN_WIDTH
      screen.y = pos.vector.y % SCREEN_HEIGHT
      screen.screenIndex = getScreenIndex(pos.vector)
    }
  }
}


class MovementSystem {
  static update(level, dt) {
    // TODO: Pass in the physics to apply
    const physics = new Physics()
    const bodies = Query.find(level, [Force, Mass, Position, ScreenPosition, Velocity])
    physics.update(bodies, dt)
  }
}

export { MovementSystem }