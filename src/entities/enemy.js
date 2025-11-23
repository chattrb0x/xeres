import { Collidable, Enemy, Health, Rotation, ScreenPosition, Velocity, Position, Mass, Force, MissileFired } from '../component.js'
import { Vector2 } from '../vector.js'

function makeEnemy(level, positionVector) {
  
  level.createEntity(
    [
      new Collidable(21),
      new Enemy(),
      new Force(new Vector2(0, 0)),
      new Health(10),
      new Mass(1), 
      new Position(positionVector), 
      new Rotation(), 
      new ScreenPosition(), 
      new Velocity(new Vector2(0, 0)),
      new MissileFired()
    ]
  )
}

export { makeEnemy }