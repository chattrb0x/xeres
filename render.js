import * as c from './src/component.js'
import { drawTriangle, drawBg, drawVulcan, drawMissile } from './draw.js'

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
    // console.log(`Player position: (${pos.vector.x}, ${pos.vector.y})`)
    drawTriangle(
      ctx,
      pos.vector.x,
      pos.vector.y,
      rot.angle, 2
    ) 
  }) 

  const projectileRecords = Query.findAll(level, [c.Timer, c.Position])
  projectileRecords.forEach(({ components }) => {
    const { components } = entityRecoed
    const pos = components.get(c.Position)
    const rot = components.get(c.Rotation)
    // console.log(`Projectile position: (${pos.vector.x}, ${pos.vector.y})`)
    if(rot) {
      drawMissile(
        ctx,
        pos.vector.x,
        pos.vector.y,
        rot.angle
      )
    } else {
      drawVulcan(ctx, pos.vector.x, pos.vector.y)
    }
  })

  ctx.restore()
}

export { onRender }
