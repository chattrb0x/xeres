import { Archetype } from './archetype.js'
import { Entity } from './entity.js'

class Level {
  constructor() {
    this.nextEntityId = 1
    this.archetypes = new Map()
    this.entityRecords = new Map()
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
  createEntity({ components }) {
    let archetype = this.hasArchetype(components)
    if(!archetype) {
      archetype = this.attachArchetype(components)
    }
    // Associate entity with an archetype for easy look-ip
    const entity = new Entity(this.nextEntityId)
    this.nextEntityId++
    
    const index = archetype.add(entity)
    
    // Track instances of components by constructor
    Archetype.sortComponents(components).forEach(SomeComponentType => {
      console.log(SomeComponentType.name)
      archetype.componentsByType.get(SomeComponentType.constructor).push(new SomeComponentType())
    })
    
    // store archetypes associated with an entity
    // use index to get components for a specific entity eg. archetype.componentMap.get(Position)[1] for entity in archetype.entities[1]
    this.entityRecords.set(entity, { archetype, index })
  }
  getComponent(entity, componentType) {
    const { archetype, index: entityIndex } = this.entityRecords.get(entity)
    if (!archetype) return null
    return archetype.entityComponents(entity, [componentType])[componentType]
  }
}

export { Level }