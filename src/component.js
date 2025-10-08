class Component {}
class Health extends Component {
  constructor(hp=1000) {
    super()
    this.hp = hp
  }
}
class TakesInput extends Component {}
class Position extends Component {
  constructor(x, y) {
    super()
    this.x = x
    this.y = y
  }
}
class Velocity extends Component {
  constructor(x, y) {
    super()
    this.x = x
    this.y = y
  }
}
class Hitbox extends Component {
  constructor(w, h) {
    super()
    this.w = w
    this.h = h
  }
}

export {
  TakesInput,
  Position,
  Health,
  Hitbox,
  Velocity,
}