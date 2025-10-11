import { Force } from '../component.js'
import { Query } from '../query.js'
import { Vector2 } from '../vector.js'


class InputManager {
  constructor() {
    this.keysDown = new Set()
    this.keysPressed = new Set()
    this.keysReleased = new Set()
    this.setup()
  }
  setup() {
    window.addEventListener('keydown', (e) => this.onKeyDown(e))
    window.addEventListener('keyup', (e) => this.onKeyUp(e))
  }
  onKeyDown(e) {
    if (!this.keysDown.has(e.code)) {
      this.keysPressed.add(e.code)
    }
    this.keysDown.add(e.code)
  }
  onKeyUp(e) {
    this.keysDown.delete(e.code)
    this.keysReleased.add(e.code)
  }
  getKey(keyCode) {
    return this.keysPressed.has(keyCode)
  }
  getKeyDown(keyCode) {
    return this.keysDown.has(keyCode)
  }
  getKeyUp(keyCode) {
    return this.keysReleased.has(keyCode)
  }
  endFrame() {
    this.keysPressed.clear()
    this.keysDown.clear()
    this.keysReleased.clear()
  }

}
const inputManager = new InputManager()

class InputSystem {
  static update(level, dt) {
    const entityRecords = Query.findEntitiesIn(level, [Force])
    if (!entityRecords?.length) return
    const moveStrength = 0.001
    entityRecords.forEach(entity => {
        const { components } = entity
        const entityForce = components.get(Force)
        if (inputManager.getKeyDown("ArrowLeft")) {
            entityForce.vector.add(new Vector2(-moveStrength, 0))
        }
        if (inputManager.getKeyDown("ArrowRight")) {
            entityForce.vector.add(new Vector2(moveStrength, 0))
        }
        if (inputManager.getKeyDown("Space") || inputManager.getKeyDown("ArrowUp")) {
            // -1 for up because of canvas flipped y?  
            entityForce.vector.add(new Vector2(0, -moveStrength))
        }
        if (inputManager.getKeyDown("ArrowDown")) {
            entityForce.vector.add(new Vector2(0, moveStrength))
        } 
    })
  }
}

export { InputSystem }