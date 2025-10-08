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
  constructor(x=0, y=0) {
    super()
    this.x = x
    this.y = y
  }
}
class Hitbox extends Component {
  constructor(w=10, h=10) {
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