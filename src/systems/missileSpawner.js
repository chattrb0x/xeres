import { Health, Rotation, ScreenPosition, Velocity, Position, Mass, Force, MissileFired } from '../component.js'
import { Query } from '../query.js'
import { Vector2 } from '../vector.js'

const MISSILE_ABILITIES = [
    new Force(),
    new Health(100),
    new Mass(),
    new Rotation(),
    new ScreenPosition(),
    new Velocity(new Vector2(0, -0.2)),
    new Position(),
]


class MissileSpawnerSystem {
  static update(level, dt) {
    
    Query.findAll(level, [MissileFired])?.forEach(({ components }) => {
        // TODO: Factor in the player's velocity
        // TODO: get the players rotation to calculate missile veloctity direction
        const firedFlag = components.get(MissileFired)
        if (firedFlag.fired) {
            let missileData = []
            for (let i = 0; i < MISSILE_ABILITIES.length; i++) {
                if (MISSILE_ABILITIES[i] instanceof Position) {
                    missileData.push(new Position(new Vector2(firedFlag.startX, firedFlag.startY)))
                } 
                else if (MISSILE_ABILITIES[i] instanceof Velocity) {
                    console.log(firedFlag.fireAngle)
                    const v = MISSILE_ABILITIES[i].vector
                    const rotatedX = v.x * Math.cos(firedFlag.fireAngle) - v.y * Math.sin(firedFlag.fireAngle)
                    const rotatedY = v.x * Math.sin(firedFlag.fireAngle) + v.y * Math.cos(firedFlag.fireAngle)
                    missileData.push(
                        new Velocity(
                            new Vector2(
                                rotatedX,
                                rotatedY,   
                            )
                        )
                    )
                } else {
                    missileData.push(MISSILE_ABILITIES[i])
                }
            }
            console.log(missileData) 
            level.createEntity(missileData)
            console.log("Missile Spawned")
        }
        
        firedFlag.fired = false
    })    
  }
}

export { MissileSpawnerSystem, MISSILE_ABILITIES }