import { Vector2 } from "./vector.js"

class Component {}
class BackgroundLayer extends Component {}
class Health extends Component {
  constructor(hp=1000) {
    super()
    this.hp = hp
  }
}
class TakesInput extends Component {}
class ScreenPosition extends Component {
  constructor() {
    super()
    this.x = 0 
    this.y = 0
    this.screenIndex = 0
  }
}
class Position extends Component {
  constructor(v = new Vector2(0, 0)) {
    super()
    this.vector = v
  }
}
class Velocity extends Component {
  constructor(v = new Vector2(0, 0), maxSpeed=3) {
    super()
    this.vector = v
    this.maxSpeed = maxSpeed
  }
}
class Rotation extends Component {
  constructor() {
    super()
    this.angle = Math.PI / 2
    this.rotationSpeed = 0
  }
}

class Hitbox extends Component {
  constructor(w=10, h=10) {
    super()
    this.w = w
    this.h = h
  }
}
class Mass extends Component {
  constructor(mass=1) {
    super()
    this.mass = mass
  }
}
class Force extends Component {
  constructor(v = new Vector2(0, 0)){
    super()
    this.vector = v
  }
}
class Follows extends Component {
  constructor(entity, w, h) {
    super()
    this.entity = entity
    this.w = w 
    this.h = h
  }
}
class Timer extends Component {
  constructor(lifeTime=1, time=0) {
    super()
    this.lifeTime = lifeTime
    this.time = time
  }
}
class MissileFired extends Component {
  constructor(startPosition=new Vector2(0, 0), startVelocity=new Vector2(0, 0), fireAngle=0) {
    super()
    this.startPosition = startPosition
    this.startVelocity = startVelocity
    this.fireAngle = fireAngle
    this.fired = false
  }
}

export {
  BackgroundLayer,
  Rotation,
  ScreenPosition,
  TakesInput,
  Position,
  Health,
  Hitbox,
  Velocity,
  Mass,
  Force,
  Follows,
  MissileFired,
  Timer
}