import { Archetype } from './archetype.js'
import { Entity } from './entity.js'

class Level {
  constructor(size=16) {
    this.nextEntityId = 1  // WARNING: Do not use this as an index
    this.archetypes = new Map()
    this.entityRecords = new Map()
    this.freeIds = [] // Maintain a stack for recycling freed IDs when entities are destroyed.
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
    this.entityRecords.set(entity, { archetype, index })
    return entity
  }
  destroyEntity(entity){
    const { archetype, index } = this.entityRecords.get(entity) 
    this.entityRecords.delete(entity)
    archetype.removeEntity(index)
    this.freeIds.push(entity.id)
  }
  getComponent(entity, componentType) {
    const { archetype, index: entityIndex } = this.entityRecords.get(entity)
    if (!archetype) return null
    return archetype.entityComponents(entity, [componentType]).get(componentType)
  }
}

export { Level }