import { Archetype } from './archetype.js'
import { Entity } from './entity.js'
import { Screen, SCREEN_WIDTH, SCREEN_HEIGHT } from './screen.js'

class Level {
  constructor(size=16) {
    this.nextEntityId = 1
    this.archetypes = new Map()
    this.entityRecords = new Map()
    
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

    // Associate entity with an archetype for easy look-ip
    const entity = new Entity(this.nextEntityId)
    this.nextEntityId++
    
    const index = archetype.add(entity, components)
    
    // store archetypes associated with an entity
    // use index to get components for a specific entity eg. archetype.componentMap.get(Position)[1] for entity in archetype.entities[1]
    this.entityRecords.set(entity, { archetype, index })

    return entity
  }
  getComponent(entity, componentType) {
    const { archetype, index: entityIndex } = this.entityRecords.get(entity)
    if (!archetype) return null
    return archetype.entityComponents(entity, [componentType]).get(componentType)
  }
}

export { Level }