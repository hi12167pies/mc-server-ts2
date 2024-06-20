import { PositionLook } from "../position"
import { World } from "../world/world"

let globalEntityId = 0

export class Entity {
  constructor(
    public world: World
  ) {}

  public eid: number = globalEntityId++
  
  public position: PositionLook = {
    x: 0, y: 0, z: 0, yaw: 0, pitch: 0
  }
}