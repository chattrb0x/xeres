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
  rotate(angle) {
    const cosTheta = Math.cos(angle)
    const sinTheta = Math.sin(angle)
    const rotatedX = this.x * cosTheta - this.y * sinTheta
    const rotatedY = this.x * sinTheta + this.y * cosTheta
    this.x = rotatedX
    this.y = rotatedY
    return this
  }
  magnitude(){
    return Math.sqrt(this.x*this.x + this.y*this.y)
  }
  angle() {
    // Why subtract Pi / 2 ? 
    return Math.atan(this.y / this.x) - Math.PI /2 
  }
  dot(other) {
    return this.x * other.x + this.y * other.y
  }
  angleBetween(other) {
    return Math.acos(this.dot(other) / this.magnitude() / other.magnitude()) + Math.PI / 2
  }
  clone() {
    return new Vector2(this.x, this.y)
  }
}

export { Vector2 }