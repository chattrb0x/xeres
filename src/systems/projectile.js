import { Health, Rotation, ScreenPosition, Velocity, Position, Mass, Force, MissileFired, Timer } from '../component.js'
import { Query } from '../query.js'
import { Vector2 } from '../vector.js'
import { MISSILE_ABILITIES, BULLET_ABILITIES } from '../entities/projectile.js'

const MISSILE_LIFE_TIME = 1600
const MISSILE_SLOW_TIME = 30
const MISSILE_FIRE_COOLDOWN = 20

class ProjectileSystem {
  static setup(level) {
      this.level = level
      this.eventBus = level.eventBus
      
      this.eventBus.on('player:fire', ProjectileSystem.onFire.bind(this))
  }
  static onFire({ entity, projectile }) {
      if (projectile === 'missile') {
        const lastFired = entity.components.get(MissileFired)
        // console.log([...entity.components.keys()].map(k => k.name))
        if (lastFired?.timeSinceLastFire > MISSILE_FIRE_COOLDOWN) {
            this.level.createEntity(MISSILE_ABILITIES)
            lastFired.timeSinceLastFire = 0
        }
        lastFired.timeSinceLastFire += 1
      }
      if (projectile === 'gun') {
          this.level.createEntity(BULLET_ABILITIES)
      }
  }
  static update(level, dt) {
    // Destroy projectiles after lifetime. 
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

export { ProjectileSystem }