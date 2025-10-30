import { Query } from '../query.js'
import { Vector2 } from '../vector.js'
import { Force, Rotation, MissileFired, Position, Velocity, TakesInput } from '../component.js'

let touchActive = false
class InputManager {
  constructor() {
    this.keysDown = new Set()
    this.keysPressed = new Set()
    this.keysReleased = new Set()
    this.clickCoord = null
  }
  setup(canvas) {
    window.addEventListener('keydown', (e) => this.onKeyDown(e))
    window.addEventListener('keyup', (e) => this.onKeyUp(e))
    // Setup click handling for canvas
    canvas.addEventListener("click", (e) => {
      if(touchActive) return
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.clickCoord = new Vector2(mouseX, mouseY)
    })
    canvas.addEventListener("touchstart", e => {
      touchActive = true
      const touches = e.changedTouches
      const rect = canvas.getBoundingClientRect()
      const x = touches[0].clientX - rect.left
      const y = touches[0].clientY - rect.top
      this.clickCoord = new Vector2(x, y)
    })
    canvas.addEventListener("touchend", e => { touchActive = false })
    canvas.addEventListener("touchmove", e => {
      if(!touchActive) return
      const touches = e.changedTouches
      const rect = canvas.getBoundingClientRect()
      const x = touches[0].clientX - rect.left
      const y = touches[0].clientY - rect.top
      this.clickCoord = new Vector2(x, y) 
    })
    
    document.getElementById("forward").addEventListener("click", () => {
      // Pretend we pushed `W`
      const fastCode = "KeyW"
      if (!this.keysDown.has(fastCode)) {
        this.keysPressed.add(fastCode)
      }
      this.keysDown.add(fastCode)
    })
    document.getElementById("backward").addEventListener("click", () => {
      // Pretend we pushed `S`
      const slowCode = "KeyS"
      if (!this.keysDown.has(slowCode)) {
        this.keysPressed.add(slowCode)
      }
      this.keysDown.add(slowCode)
    })
    document.getElementById("fire").addEventListener("click", () => {
      // Pretend we pushed `Space`
      const fireCode = "Space"
      if (!this.keysDown.has(fireCode)) {
        this.keysPressed.add(fireCode)
      }
      this.keysDown.add(fireCode)
    })
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
    this.clickCoord = null
  }

}
const INPUT_MANAGER = new InputManager()

class InputSystem {
  static update(level, dt) {
    // TODO: Just the player and not everything with force and rotation? 
    const entityRecords = Query.findAll(level, [Position, Force, Rotation, MissileFired, Velocity, TakesInput])
    if (!entityRecords?.length) return
    const moveStrength = 0.001
    entityRecords.forEach(entity => {
        const { components } = entity
        const entityForce = components.get(Force)
        const entityRotation = components.get(Rotation)
        const entityMissile = components.get(MissileFired)
        const entityPosition = components.get(Position)
        const entityVelocity = components.get(Velocity)
        if (INPUT_MANAGER.getKeyDown("KeyW")) {
            entityForce.vector.add(new Vector2(0, -moveStrength).rotate(entityRotation.angle))
        } 
        if (INPUT_MANAGER.getKeyDown("KeyS")) {
            entityForce.vector.add(new Vector2(0, moveStrength).rotate(entityRotation.angle))
        } 
        if (INPUT_MANAGER.getKeyDown("Space")) {
          entityMissile.fired = true
          entityMissile.startPosition = entityPosition.vector.clone()
          entityMissile.fireAngle = entityRotation.angle
          entityMissile.startVelocity = entityVelocity.vector.clone()
        }
        if (INPUT_MANAGER.clickCoord !== null) {
          // TODO: Remove subtraction of -100 when we remove SCREEN_CENTER_OFFSET_X and SCREEN_CENTER_OFFSET_Y
          const dx = INPUT_MANAGER.clickCoord.x - entityPosition.vector.x// - 100;
          const dy = INPUT_MANAGER.clickCoord.y - entityPosition.vector.y// - 100;
          // Not sure why we need to add Pi/2 lol.
          entityRotation.angle = Math.atan2(dy,dx) + Math.PI / 2
          console.log(entityRotation.angle)
        }  
    })
    INPUT_MANAGER.endFrame()
  }
}

export { InputSystem, INPUT_MANAGER }