import { Enemy, Health, Rotation, ScreenPosition, Velocity, Position, Mass, Force } from '../component.js'
import { Query } from '../query.js'
import { Vector2 } from '../vector.js'
const randomVector = (scaler) => new Vector2(
  Math.random() * 3 * scaler, 
  Math.random() * 3 * scaler
)
const ENEMY_ABILITIES = [
    new Enemy(),
    new Force(new Vector2(0, 0)), 
    new Mass(1), 
    new Position(randomVector(100)), 
    new Rotation(), 
    new ScreenPosition(), 
    new Velocity(new Vector2(0, 0))
]

let count = 0
class EnemySpawnerSystem {
  static update(level, dt) {
    if (count < 14) {
      level.createEntity([
        new Enemy(),
        new Force(randomVector(0.001)), 
        new Mass(1), 
        new Position(randomVector(100)), 
        new Rotation(), 
        new ScreenPosition(), 
        new Velocity(new Vector2(0, 0))
      ])
       count++
    }
  }
}

export { EnemySpawnerSystem, ENEMY_ABILITIES }