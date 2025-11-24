import { Health, Rotation, ScreenPosition, Velocity, Position, Mass, Force, MissileFired, Timer, Projectile, Collidable } from '../component.js'
import { Query } from '../query.js'
import { Vector2 } from '../vector.js'


const PROJECTILE_COLLIDER_SIZE = 25

function makeProjectile(level, projectileType, positionVector) {
    level.createEntity(
        [
            new Collidable(PROJECTILE_COLLIDER_SIZE),
            new Force(),
            new Mass(1),
            new Rotation(),
            new ScreenPosition(),
            new Velocity(new Vector2(1, 0)),
            new Position(positionVector.clone().add(new Vector2(PROJECTILE_COLLIDER_SIZE, 0))),
            new Timer(),
            new Projectile(projectileType)
        ]
    )
}

export { makeProjectile }