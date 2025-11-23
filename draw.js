// TODO: convert this into a system

function drawTriangle(ctx, centerX, centerY, angle, height=1, width=1, color='#EEEEEE') {
  const cosTheta = Math.cos(angle)
  const sinTheta = Math.sin(angle)
  
  const p0 = { x: 0, y: -11 * height } // Tip (relative to center)
  const p1 = { x: -5 * width, y: 5 }  // Left-ish point
  const p2 = { x: 5 * width, y: 5 }   // Right-ish point
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
  ctx.strokeStyle = color
  ctx.stroke()
}
function drawVulcan(ctx, x, y) {
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(x, y, 10, 10)
}

function drawBg(ctx, x, y) {
  ctx.fillStyle = '#DDDDDD'
  ctx.fillRect(x, y, 1, 1)
}

export { drawTriangle, drawBg, drawVulcan }