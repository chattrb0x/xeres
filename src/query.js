class Query {
  static findEntitiesIn(level, componentTypes) {
    const results = []
    for (const [entity, data] of level.entityRecords) {
      console.log(entity.id)
      const { archetype, index } = data
      console.log(archetype.entityIds)
      console.log(archetype.componentsByType.size)
      // Check if archetype has all required components
      const hasAll = componentTypes.every(type => archetype.componentsByType.has(type.constructor)
      )
      if (!hasAll) return
      
      // Gather the actual component instances for this entity
      const components = archetype.entityComponents(entity, componentTypes)
     
      results.push({ entity, components })
    }
    console.log('q:', results)
    return results
  }
}

export { Query }