import { Enemy, Health, Rotation, ScreenPosition, Velocity, Position, Mass, Force, TakesInput, MissileFired } from '../component.js'
import { Query } from '../query.js'
import { Vector2 } from '../vector.js'


const PLAYER_DETECTION_RADIUS = 10000

class EnemyScriptSystem {
  static update(level, dt) {
    const enemyRecords = Query.findAll(level, [Enemy, Force, Mass, Position, Rotation, ScreenPosition, Velocity, MissileFired])
    const players = Query.findAll(level, [TakesInput, Force, Mass, Position, ScreenPosition, Velocity])

    // Update the rotation of any enemy within radius of a player
    // TODO: Limit range of search based on World address
    for (const enemy of enemyRecords) {
        const enemyPosition = enemy.components.get(Position)
        let closestPlayerPosition = null
        let closestPlayerDistance = null
        for (const player of players) {
            const playerPosition = player.components.get(Position)
            const playerDistance = enemyPosition.vector.clone().subtract(playerPosition.vector.clone()).magnitude()
            if (playerDistance <= PLAYER_DETECTION_RADIUS && (closestPlayerPosition === null || closestPlayerDistance < playerDistance)) {
                // console.log(player, "within", PLAYER_DETECTION_RADIUS, "of", enemy)
                closestPlayerPosition = playerPosition
                closestPlayerDistance = playerDistance
            }
        }
        // console.log(enemy, "CLOSEST PLAYER", closestPlayer)
        if (closestPlayerPosition !== null) {
            const enemyRotation = enemy.components.get(Rotation)
            const enemyMissileFired = enemy.components.get(MissileFired)
            const enemyToPlayerVector =  closestPlayerPosition.vector.clone().subtract(enemyPosition.vector.clone())
            const angleToPlayer = enemyToPlayerVector.angle() // closestPlayerPosition.vector.clone().angleBetween(enemyPosition.vector.clone())
            enemyRotation.angle = angleToPlayer
            // enemyMissileFired.fired = true
            // enemyMissileFired.startPosition = enemyPosition.vector.clone()            
            // enemyMissileFired.fireAngle = angleToPlayer
            // enemyMissileFired.startVelocity = enemyPosition.vector.clone()
        }
    }

  }
}

export { EnemyScriptSystem }