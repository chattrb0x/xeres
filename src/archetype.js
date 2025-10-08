class Archetype {
  constructor(components) {
    this.componentsByType = new Map()
    this.entityIds = []
    Archetype.sortComponents(components).forEach(cType => {
      this.componentsByType.set(cType.constructor, [])
    })
  }
  static sortComponents(components) {
    return components.sort((a, b) => a.name.localeCompare(b.name))
  }
  static makeSignature(components) {
    return components?.length ? Archetype.sortComponents(components).join('.') : ''
  }
  get signature() {
    return Archetype.makeSignature(this.componentsByType.keys())
  }
  add(entity) {
    this.entityIds.push(entity.id)
    // return the index of the entity
    return this.entityIds.length - 1
  }
  entityComponents(entity, componentTypes) {
    const index = this.entityIds.indexOf(entity.id)
    const componentsForEntity = {}
    componentTypes.forEach(type => {
      componentsForEntity[type] = this.componentsByType.get(type.constructor)[index]
      console.log(type)
    })
    return componentsForEntity
  }
}

export { Archetype }