import { Vector2 } from "./vector.js"

class Component {}
class Health extends Component {
  constructor(hp=1000) {
    super()
    this.hp = hp
  }
}
class TakesInput extends Component {}
class Position extends Component {
  constructor(v = new Vector2(0, 0)) {
    super()
    this.vector = v
  }
}
class Velocity extends Component {
  constructor(v = new Vector2(0, 0)) {
    super()
    this.vector = v
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

export {
  TakesInput,
  Position,
  Health,
  Hitbox,
  Velocity,
  Mass,
  Force,
}