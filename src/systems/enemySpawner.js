import { Health, Rotation, ScreenPosition, Velocity, Position, Mass, Force } from '../component.js'
import { Query } from '../query.js'
import { Vector2 } from '../vector.js'

const ENEMY_ABILITIES = [
    new Force(new Vector2(0, 0)), 
    new Health(1000), 
    new Mass(0), 
    new Position(new Vector2(100, Math.random() * 100)), 
    new Rotation(), 
    new ScreenPosition(), 
    new Velocity(new Vector2(0, 0))
]

class EnemySpawnerSystem {
  static update(level, dt) {
    if (level.nextEntityId < 2400) {
        level.createEntity(ENEMY_ABILITIES)
    }
  }
}

export { EnemySpawnerSystem, ENEMY_ABILITIES }