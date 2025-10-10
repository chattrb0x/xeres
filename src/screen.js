const SCREEN_HEIGHT = 240
const SCREEN_WIDTH = 320

class Screen {
  constructor(w=SCREEN_WIDTH, h=SCREEN_HEIGHT, worldIndex) {
    this.h = h 
    this.w = w 
    this.index = worldIndex
  }
}

export { Screen, SCREEN_WIDTH, SCREEN_HEIGHT }