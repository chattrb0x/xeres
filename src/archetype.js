class Archetype {
  constructor(components) {
    this.componentsByType = new Map()
    this.entityIds = []
    Archetype._sortComponents(components).forEach(cType => {
      this.componentsByType.set(cType, [])
    })
  }
  static _sortComponents(components) {
    return components.sort((a, b) => a.name.localeCompare(b.name))
  }
  static makeSignature(components) {
    return components?.length ? Archetype._sortComponents(components).join('.') : ''
  }
  get signature() {
    return Archetype.makeSignature(this.componentsByType.keys())
  }
  add(entity, components) {
    this.entityIds.push(entity.id)
    
    // Track instances of components by constructor
    // No sorting required; Map already sorted at instantiation
    components.forEach(instance => {
      this.componentsByType.get(instance.constructor).push(instance)
    })
    
    // return the index of the entity
    return this.entityIds.length - 1
  }
  // Explicitly request components
  entityComponents(entity, componentTypes) {
    const index = this.entityIds.indexOf(entity.id)
    // !: returns ref to already allocated component instance 
    const componentsForEntity = new Map()
    componentTypes.forEach(type => {
      const instances = this.componentsByType.get(type)
      componentsForEntity.set(type, instances[index])
    })
    return componentsForEntity
  }
}

export { Archetype }