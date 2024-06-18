import { PositionLook } from "../position"

let globalEntityId = 0

export class Entity {
  public id: number = globalEntityId++
  public position: PositionLook = {
    x: 0, y: 0, z: 0, yaw: 0, pitch: 0
  }
}