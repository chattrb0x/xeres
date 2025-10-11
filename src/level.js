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
  createEntity(componentMap){
    /*
      Args:
        components: A map of the type of a component to an instance of that component.
    */
    let componentTypes = []
    for (const [key, value] of componentMap) {
      if (!(value instanceof key)) {
        throw new Error(`Expected object in component map to be an instance of its respective key. Got {${key}: ${value}}`)
      }
      componentTypes.push(key)
    }  
    
    let archetype = this.hasArchetype(componentTypes)
    if(!archetype) {
      archetype = this.attachArchetype(componentTypes)
    }

    // Associate entity with an archetype for easy look-ip
    const entity = new Entity(this.nextEntityId)
    this.nextEntityId++
    
    const index = archetype.add(entity, componentMap)
    
    // store archetypes associated with an entity
    // use index to get components for a specific entity eg. archetype.componentMap.get(Position)[1] for entity in archetype.entities[1]
    this.entityRecords.set(entity, { archetype, index })

    return entity
  }
  createEntityByType({ components }) {
    /*
      Args:
        componentTypes: The types of the new components to create. New component instances will be created with default args.
    */
    let archetype = this.hasArchetype(components)
    if(!archetype) {
      archetype = this.attachArchetype(components)
    }

    // Associate entity with an archetype for easy look-ip
    const entity = new Entity(this.nextEntityId)
    this.nextEntityId++
    
    const index = archetype.addByType(entity, components)
    
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