import { Query } from './src/query.js'
import * as c from './src/component.js'
import { drawTriangle, drawBg, drawVulcan } from './draw.js'

function onRender(ctx, canvas, level) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  
  const camera = Query.find(level, [c.Follows, c.ScreenPosition])
  const camPos = camera.components.get(c.ScreenPosition)
  ctx.translate(-camPos.x, -camPos.y)

  const bg = Query.findAll(level, [c.BackgroundLayer, c.Position])
  bg.forEach(({ components }) => {
    const pos = components.get(c.Position)
    drawBg(ctx, pos.x, pos.y)
  })
  
  // Query player position for rendering 
  let entityRecords = Query.findAll(level, [c.TakesInput, c.Position, c.Rotation])
  entityRecords.forEach(({ components }) => {
    const pos = components.get(c.Position)
    const rot = components.get(c.Rotation)
    // console.log(`Player position: (${pos.vector.x}, ${pos.vector.y})`)
    drawTriangle(
      ctx,
      pos.vector.x,
      pos.vector.y,
      rot.angle
    ) 
  })
  // Baddies
  entityRecords = Query.findAll(level, [c.Enemy, c.Position, c.Rotation])
  entityRecords.forEach(({ components }) => {
    const pos = components.get(c.Position)
    const rot = components.get(c.Rotation)
    // console.log(`Enemy position: (${pos.vector.x}, ${pos.vector.y})`)
    drawTriangle(
      ctx,
      pos.vector.x,
      pos.vector.y,
      rot.angle, 2
    ) 
  }) 

  const projectileRecords = Query.findAll(level, [c.Timer, c.Position, c.Rotation, c.Projectile])
  projectileRecords.forEach(({ components }) => {
    const pos = components.get(c.Position)
    const rot = components.get(c.Rotation)
    const proj = components.get(c.Projectile)
    // console.log(`Projectile position: (${pos.vector.x}, ${pos.vector.y})`)
    
    if (proj.projectileType === "missile") {
        drawTriangle(
          ctx,
          pos.vector.x,
          pos.vector.y,
          rot.angle,
          0.4,
          0.5,
          '#FF0000',
        )
    } else if (proj.projectileType === "bullet") {
        drawTriangle(
          ctx,
          pos.vector.x,
          pos.vector.y,
          rot.angle,
          0.2,
          0.25,
          '#ff00eeff',
        )
    } else {
      console.log("Got unknown projectile type: ", proj.projectileType)
    }
    
  })

  ctx.restore()
}

export { onRender }
