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

const MISSILE_LIFE_TIME = 600
const MISSILE_SLOW_TIME = 30
const MISSILE_FIRE_COOLDOWN = 20

class MissileSpawnerSystem {
  static update(level, dt) {
    // TODO: Despawn or detonate missiles after a certain amount of time.
    Query.findAll(level, [MissileFired])?.forEach(({ components }) => {
        const firedFlag = components.get(MissileFired)
        if (firedFlag.fired && firedFlag.timeSinceLastFire > MISSILE_FIRE_COOLDOWN) {
            level.createEntity(
                [
                    new Force(),
                    new Health(100),
                    new Mass(),
                    new Rotation(),
                    new ScreenPosition(),
                    new Velocity(new Vector2(0, -0.1).rotate(firedFlag.fireAngle).add(firedFlag.startVelocity)),
                    new Position(firedFlag.startPosition.clone()),
                    new Timer(MISSILE_LIFE_TIME)
                ]
            )
            firedFlag.timeSinceLastFire = 0
        }
        firedFlag.timeSinceLastFire += 1
        firedFlag.fired = false
    })

    // Destroy missiles after lifetime. 
    // And speed up missiles after slow time. 
    Query.findAll(level, [Timer, Velocity])?.forEach(({ entity, components }) => {
        const timer = components.get(Timer)
        const velocity = components.get(Velocity)
        if (timer.time > timer.lifeTime) {
            level.destroyEntity(entity)
        } else if (timer.time > MISSILE_SLOW_TIME) {
            velocity.vector.scale(2)
        }
        timer.time += 1
    })       
  }
}

export { MissileSpawnerSystem, MISSILE_ABILITIES }