import { Health, Rotation, ScreenPosition, Velocity, Position, Mass, Force, MissileFired } from '../component.js'
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
]


class MissileSpawnerSystem {
  static update(level, dt) {
    // TODO: Despawn or detonate missiles after a certain amount of time.
    Query.findAll(level, [MissileFired])?.forEach(({ components }) => {
        const firedFlag = components.get(MissileFired)
        if (firedFlag.fired) {
            level.createEntity(
                [
                    new Force(),
                    new Health(100),
                    new Mass(),
                    new Rotation(),
                    new ScreenPosition(),
                    new Velocity(new Vector2(0, -1).rotate(firedFlag.fireAngle).add(firedFlag.startVelocity)),
                    new Position(firedFlag.startPosition.clone()),
                ]
            )
        }
        
        firedFlag.fired = false
    })    
  }
}

export { MissileSpawnerSystem, MISSILE_ABILITIES }