import { Health, Rotation, ScreenPosition, Velocity, Position, Mass, Force } from '../component.js'
import { Query } from '../query.js'
import { Vector2 } from '../vector.js'

const ENEMY_ABILITIES = [Force, Health, Mass, Position, Rotation, ScreenPosition, Velocity]

function makeEnemyArchitype(
    forceVector = new Vector2(0, 0),
    health=1000,
    mass=0,
    positionVector = new Vector2(-120, -120),
    velocityVector = new Vector2(0, 0),
) {
    let componentMap = new Map()
    componentMap.set(Force, new Force(forceVector))
    componentMap.set(Health, new Health(health))
    componentMap.set(Mass, new Mass(mass))
    componentMap.set(Position, new Position(positionVector))
    componentMap.set(ScreenPosition, new ScreenPosition())
    componentMap.set(Velocity, new Velocity(velocityVector))

    return componentMap
}

class EnemySpawnerSystem {
  static update(level, dt) {
    if (level.nextEntityId < 3000) {
        level.createEntity(makeEnemyArchitype())
    }
  }
}

export { EnemySpawnerSystem, ENEMY_ABILITIES }