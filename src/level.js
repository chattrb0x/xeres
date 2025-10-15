import { Archetype } from './archetype.js'
import { Entity } from './entity.js'
import { Screen, SCREEN_WIDTH, SCREEN_HEIGHT } from './screen.js'

class Level {
  constructor(size=16) {
    this.nextEntityId = 1  // WARNING: Do not use this as an index
    this.archetypes = new Map()
    this.entityRecords = new Map()
    this.freeIds = [] // Maintain a stack for recycling freed IDs when entities are destroyed.
    
    this.screens = []
    for(let i = 0; i < size; i++) {
      this.screens.push(new Screen(SCREEN_WIDTH, SCREEN_HEIGHT, i))
    }
  }
  hasArchetype(components) {
    const sig = Archetype.makeSignature(components)
    if(!sig) throw new Error('Unable to get archetype signature.')
    return this.archetypes.get(sig)
  }
  attachArchetype(components) {
    const archetype = new Archetype(components)
    this.archetypes.set(archetype.signature, archetype)
    return archetype
  }
  createEntity(components){
    const componentTypes = components.map(c => c.constructor)
   
    let archetype = this.hasArchetype(componentTypes)
    if(!archetype) {
      archetype = this.attachArchetype(componentTypes)
    }

    // Associate entity with an archetype for easy look-up
    const id = this.freeIds.length > 0
      ? this.freeIds.pop()
      : this.nextEntityId++
    const entity = new Entity(id)
    
    const index = archetype.add(entity, components)
    
    // store archetypes associated with an entity
    // use index to get components for a specific entity eg. archetype.componentMap.get(Position)[1] for entity in archetype.entities[1]
    this.entityRecords.set(entity, { archetype })
    return entity
  }
  destroyEntity(entity){
    const { archetype } = this.entityRecords.get(entity) 
    this.entityRecords.delete(entity)
    
    // Remove from archetype entityIds with swap&pop.
    const idx = archetype.entityIds.indexOf(entity.id)
    if (idx !== -1) {
      const last = archetype.entityIds.pop()
      if (idx < archetype.entityIds.length) archetype.entityIds[idx] = last
    }
    this.freeIds.push(entity.id);
  }
  getComponent(entity, componentType) {
    const { archetype } = this.entityRecords.get(entity)
    if (!archetype) return null
    return archetype.entityComponents(entity, [componentType]).get(componentType)
  }
}

export { Level }