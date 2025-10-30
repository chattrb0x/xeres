// TODO: convert this into a system

function drawTriangle(ctx, centerX, centerY, angle, scale=1) {
  const cosTheta = Math.cos(angle)
  const sinTheta = Math.sin(angle)
  
  const p0 = { x: 0, y: -11 * scale } // Tip (relative to center)
  const p1 = { x: -5, y: 5 }  // Left-ish point
  const p2 = { x: 5, y: 5 }   // Right-ish point
  const vertices = [p0, p1, p2]
  ctx.beginPath()
  
  // Iterate through the vertices, rotate them, and move them to the correct position (centerX, centerY)
  for (let i = 0; i < vertices.length; i++) {
    const p = vertices[i]
    const rotatedX = p.x * cosTheta - p.y * sinTheta
    const rotatedY = p.x * sinTheta + p.y * cosTheta
    
    // Final position: Rotated position + Center position
    const finalX = rotatedX + centerX
    const finalY = rotatedY + centerY

    if (i === 0) {
      ctx.moveTo(finalX, finalY)
    } else {
      ctx.lineTo(finalX, finalY)
    }
  }

  ctx.closePath()
  ctx.strokeStyle = '#EEEEEE'
  ctx.stroke()
}
function drawVulcan(ctx, x, y) {
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(x, y, 3, 3)
}
function drawMissile(ctx, centerX, centerY, angle) {
  const cosTheta = Math.cos(angle)
  const sinTheta = Math.sin(angle)
  
  const p0 = { x: 0, y: -5 } // Tip (relative to center)
  const p1 = { x: -2, y: 2 }  // Left-ish point
  const p2 = { x: 2, y: 2 }   // Right-ish point
  const vertices = [p0, p1, p2]
  ctx.beginPath()
  
  // Iterate through the vertices, rotate them, and move them to the correct position (centerX, centerY)
  for (let i = 0; i < vertices.length; i++) {
    const p = vertices[i]
    const rotatedX = p.x * cosTheta - p.y * sinTheta
    const rotatedY = p.x * sinTheta + p.y * cosTheta
    
    // Final position: Rotated position + Center position
    const finalX = rotatedX + centerX
    const finalY = rotatedY + centerY
    
    if (i === 0) {
      ctx.moveTo(finalX, finalY)
    } else {
      ctx.lineTo(finalX, finalY)
    }
  }

  ctx.closePath()
  ctx.strokeStyle = '#FF0000'
  ctx.stroke()
}
function drawBg(ctx, x, y) {
  ctx.fillStyle = '#DDDDDD'
  ctx.fillRect(x, y, 1, 1)
}

export { drawTriangle, drawBg, drawVulcan, drawMissile }