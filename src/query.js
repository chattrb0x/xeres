import { Position } from './component.js'

class Query {
  static findAll(level, componentTypes) {
    const results = []
    for (const [entity, data] of level.entityRecords) {
      
      const { archetype, index } = data
      
      // Check if archetype has all components passed as arg
      const hasAll = componentTypes.every(type => {
        // console.log(type.name, archetype.componentsByType.has(type))
        return archetype.componentsByType.has(type)
      })
      if (!hasAll) continue
      
      // Gather the actual component instances for this entity
      const components = archetype.entityComponents(entity, componentTypes)
      results.push({ entity, components })
    }
    return results
  }
  static find(level, componentTypes) {
    const results = Query.findAll(level, componentTypes)
    return results[0]
  }
}

export { Query }