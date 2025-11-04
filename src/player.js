import { Collidable, Health, Rotation, ScreenPosition, TakesInput, Velocity, Position, Mass, Force, MissileFired } from './component.js'
import { Vector2 } from './vector.js'

const PLAYER_ABILITIES = [
  new Collidable(),
  new Force(),
  new Health(1000),
  new Mass(),
  new Position(new Vector2(100, 100)),
  new Rotation(),
  new ScreenPosition(),
  new TakesInput(),
  new Velocity(),
  new MissileFired()
]

export {PLAYER_ABILITIES}