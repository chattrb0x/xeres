import { BackgroundLayer, Position } from '../component.js'
import { Query } from '../query.js'

class LayerSystem {
  static setup(level, dt) {
    const bg = Query.findAll(level, [BackgroundLayer, Position])
    let row = 0
    const gridSize = 32
    for(let i=0; i < bg.length; i++) {
      const pos = bg[i].components.get(Position)
      pos.x = gridSize + ((i % 64) * gridSize)
      if(i % 64 === 0) row++
      pos.y = row * gridSize
    }
  }
}

export { LayerSystem }