import { Archetype } from './archetype.js'
import { Entity } from './entities/entity.js'

class Event {
  constructor(name, payload) {
    this.name = name
    this.payload = payload
    this.timestamp = Date.now()
  }
}
class EventBus {
  constructor() {
    this.listeners = new Map()
  }
  on(eventName, callback, priority = 0) {
    if (!this.listeners.has(eventName)) this.listeners.set(eventName, [])

    const listener = { callback, priority }
    const listeners = this.listeners.get(eventName)
    
    // Insert based on priority (higher priority = earlier execution)
    const index = listeners.findIndex(l => l.priority < priority)
    if (index === -1) {
      listeners.push(listener)
    } else {
      listeners.splice(index, 0, listener)
    }

    // Return unsubscribe function
    return () => this.off(eventName, callback)
  }

  // Unsubscribe from an event
  off(eventName, callback) {
    if (!this.listeners.has(eventName)) return

    const listeners = this.listeners.get(eventName)
    const index = listeners.findIndex(l => l.callback === callback)
    
    if (index !== -1) {
      listeners.splice(index, 1)
    }

    // Clean up empty listener arrays
    if (listeners.length === 0) this.listeners.delete(eventName)
  }

  // Subscribe to an event once
  once(eventName, callback, priority = 0) {
    const wrappedCallback = (...args) => {
      this.off(eventName, wrappedCallback)
      callback(...args)
    }
    return this.on(eventName, wrappedCallback, priority)
  }

  // Emit an event immediately
  emit(eventName, payload = {}) {
    if (!this.listeners.has(eventName)) return

    const listeners = this.listeners.get(eventName)
    for (const listener of listeners) {
      listener.callback(payload)
    }
  }
  emitDeferred(eventName, payload = {}) {
    requestAnimationFrame(() => this.emit(eventName, payload))
  }
  clear(eventName = null) {
    if (eventName) {
      this.listeners.delete(eventName)
    } else {
      this.listeners.clear()
    }
  } 
}
class Level {
  constructor(size=16) {
    this.nextEntityId = 1  // WARNING: Do not use this as an index
    this.archetypes = new Map()
    this.entityRecords = new Map()
    this.eventBus = new EventBus()
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