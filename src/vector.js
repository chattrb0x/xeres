class Vector2 {
  constructor(x=0, y=0) {
    this.x = x
    this.y = y
  }
  add(v) {
    this.x += v.x
    this.y += v.y
    return this
  }
  subtract(v) {
    return this.add(v.scale(-1))
  }
  scale(s) {
    this.x *= s
    this.y *= s
    return this
  }
  clone() {
    return new Vector2(this.x, this.y)
  }
}

export { Vector2 }