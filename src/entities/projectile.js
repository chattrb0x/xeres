import { Health, Rotation, ScreenPosition, Velocity, Position, Mass, Force, MissileFired, Timer } from '../component.js'
import { Query } from '../query.js'
import { Vector2 } from '../vector.js'

const MISSILE_ABILITIES = [
    new Force(),
    new Health(100),
    new Mass(),
    new Rotation(),
    new ScreenPosition(),
    new Velocity(new Vector2(0, -1)),
    new Position(),
    new Timer(),
]

export { MISSILE_ABILITIES }