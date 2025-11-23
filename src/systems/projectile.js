import { Health, Rotation, ScreenPosition, Velocity, Position, Mass, Force, MissileFired, Timer, Projectile } from '../component.js'
import { Query } from '../query.js'
import { Vector2 } from '../vector.js'
import { makeProjectile } from '../entities/projectile.js'

const MISSILE_SLOW_TIME = 30
const MISSILE_FIRE_COOLDOWN = 40

class ProjectileSystem {
  static setup(level) {
      this.level = level
      this.eventBus = level.eventBus
      
      this.eventBus.on('player:fire', ProjectileSystem.onFire.bind(this))
  }
  static onFire({ entity, projectile }) {
    const startPosition = entity.components.get(Position)
    if (projectile === 'missile') {
        const lastFired = entity.components.get(MissileFired)
        if (lastFired?.timeSinceLastFire > MISSILE_FIRE_COOLDOWN) {
            makeProjectile(this.level, projectile, startPosition.vector.clone())
            lastFired.timeSinceLastFire = 0
        }
    } else {
        makeProjectile(this.level, projectile, startPosition.vector.clone())
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

    // Count up for missile timer cooldown every frame.
    Query.findAll(level, [MissileFired])?.forEach(({ entity, components }) => {
        const lastFired = components.get(MissileFired)
        lastFired.timeSinceLastFire += 1
    })
  }
}

export { ProjectileSystem }