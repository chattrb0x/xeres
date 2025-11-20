import { Health, Rotation, ScreenPosition, Velocity, Position, Mass, Force, MissileFired, Timer } from '../component.js'
import { Query } from '../query.js'
import { Vector2 } from '../vector.js'

const BULLET_ABILITIES = [
    new Force(),
    new Mass(1),
    new ScreenPosition(),
    new Velocity(new Vector2(1, 0)),
    new Position(),
    new Timer(),
]

const MISSILE_ABILITIES = [
    new Force(),
    new Mass(1),
    new Rotation(),
    new ScreenPosition(),
    new Velocity(new Vector2(0, -1)),
    new Position(),
    new Timer(),
]

export { MISSILE_ABILITIES, BULLET_ABILITIES }