import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../screen.js'

// Helper function to handle correct positive modulo
const positiveMod = (n, m) => ((n % m) + m) % m

const perRow = 4
// 20x15 cell
const gridSize = {
  h: SCREEN_HEIGHT / (perRow * perRow),
  w: SCREEN_WIDTH / (perRow * perRow)
}

function getGridCellIndex({ x, y }) {
  const spacing = perRow * perRow
  const xi = Math.floor(x / spacing)
  const yi = Math.floor(y / spacing)
  return xi * perRow + yi
}

function trackParticle(allPos) {
  // make array to track pos hashes
  let cellCount = makeCellCount(gridSize)
  let allEntries = new Array(allPos.length).fill(0)
  
  // store pos hashes
  allPos.forEach(entityPos => {
    const i = hashPos(entityPos.x, entityPos.y, perRow)
    cellCount[i]++   
  })
  
  // partial sum
  cellCount = cellCount.map((cell, cellIndex) => {
    const prev = cellIndex > 0 ? cellCount[cellIndex - 1] : 0
    return cell + prev
  })
  
  for (let i=0; i < numObjects; i++) {
		const h = hashPos(pos.x, pos.y, perRow)
		cellCount[h]--
		allEntries[cellCount[h]] = i
	}
}


function makeCellCount({ h, w }) {
  return new Array(h * w + 1).fill(0)
}


let particleMap = []

function intCoord(coord, spacing) {
  return Math.floor(coord / spacing)
}

function hashPos(x, y, spacing) {
  return positiveMod(
    hashCoords(intCoord(x, spacing), intCoord(y, spacing)),
    spacing
  )
}

function hashCoords(xi, yi) {
  const hash = (xi * 92837111) ^ (yi * 689287499)
  return Math.abs(hash)
}

export { hashPos }