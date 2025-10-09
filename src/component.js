class Component {}
class Health extends Component {
  constructor(hp=1000) {
    super()
    this.hp = hp
  }
}
class TakesInput extends Component {}
class Position extends Component {
  constructor(x=0, y=0) {
    super()
    this.x = x
    this.y = y
  }
}
class Velocity extends Component {
  constructor(dx=0, dy=0) {
    super()
    this.dx = dx
    this.dy = dy
    this.maxSpeed = 3
  }
}
class Rotation extends Component {
  constructor() {
    super()
    this.angle = 45
    this.rotationSpeed = 0.7
  }
}

class Hitbox extends Component {
  constructor(w=10, h=10) {
    super()
    this.w = w
    this.h = h
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

export {
  Rotation,
  TakesInput,
  Position,
  Health,
  Hitbox,
  Velocity,
  Follows,
}