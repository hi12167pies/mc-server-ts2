import { World } from "../world/world"

let globalEntityId = 0

export class Entity {
  constructor(
    public world: World
  ) {}

  public eid: number = globalEntityId++
  
  public locX: number = 0
  public locY: number = 0
  public locZ: number = 0
  public yaw: number = 0
  public pitch: number = 0
}