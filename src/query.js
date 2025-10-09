import { Position } from './component.js'

class Query {
  static findEntitiesIn(level, componentTypes) {
    const results = []
    for (const [entity, data] of level.entityRecords) {
      
      const { archetype, index } = data
      
      // Check if archetype has all required components
      const hasAll = componentTypes.every(type => {
        // console.log(type.name, archetype.componentsByType.has(type))
        return archetype.componentsByType.has(type)
      })
      if (!hasAll) continue
      
      // Gather the actual component instances for this entity
      const components = archetype.entityComponents(entity, componentTypes)
     
      results.push({ entity, components })
    }
    console.log('q:', results.length)
    return results
  }
}

export { Query }