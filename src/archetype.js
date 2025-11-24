class Archetype {
  constructor(components) {
    this.componentsByType = new Map()
    this.entityIds = []
    Archetype._sortComponents(components).forEach(cType => {
      this.componentsByType.set(cType, [])
    })
    this.freeIndices = [] // Maintain a stack for recycling freed indices when entities are destroyed.
  }
  static _sortComponents(components) {
    return components.sort((a, b) => a.name.localeCompare(b.name))
  }
  static makeSignature(components) {
    return components?.length ? Archetype._sortComponents(components).join('.') : ''
  }
  get signature() {
    return Archetype.makeSignature([...this.componentsByType.keys()])
  }
  add(entityId, components) {
    if (this.freeIndices.length == 0) {
      this.entityIds.push(entityId)
    
      // Track instances of components by constructor
      // No sorting required; Map already sorted at instantiation
      components.forEach(instance => {
        this.componentsByType.get(instance.constructor).push(instance)
      })
      return this.entityIds.length - 1
    } 
  
    // Otherwise attempt to recycle a previously used index.
    const index = this.freeIndices.pop()
    this.entityIds[index] = entityId
    components.forEach(instance => {
      this.componentsByType.get(instance.constructor)[index] = instance
    })
    return index
  }
  // Explicitly request components
  entityComponents(entityId, componentTypes) {
    const index = this.entityIds.indexOf(entityId)
    // !: returns ref to already allocated component instance 
    const componentsForEntity = new Map()
    componentTypes.forEach(type => {
      const instances = this.componentsByType.get(type)
      componentsForEntity.set(type, instances[index])
    })
    return componentsForEntity
  }
  removeEntity(index){
    // Replace the entity info at the index location with null.
    // TODO: Implement another background process to free the nulls periodically.
    this.entityIds[index] = null
    for (let components of this.componentsByType.values()) {
      components[index] = null
    }
    this.freeIndices.push(index)
  }
}


export { Archetype }