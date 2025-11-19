import { Health } from '../component.js'
import { Query } from '../query.js'

class HealthSystem {
  static setup(level) {
    this.eventBus = level.eventBus
   
    this.eventBus.on('player:health', HealthSystem.onUpdateHealth.bind(this))
  }
  static onUpdateHealth({ entities }) {
    entities.forEach(entity => {
      const health = entity.components.get(Health)
      console.log([...entity.components.values()].map(c => c.constructor.name))
      if(!health) return
      health.hp -= 100
      
      if(health.hp < 1) {
        this.eventBus.emit('destroy', { entity })
      } else {
        console.log(health.hp) 
      }
    })
  }
}

export { HealthSystem }