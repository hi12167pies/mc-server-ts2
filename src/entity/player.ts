import { Connection } from "../connnection";
import { World } from "../world/world";
import { Entity } from "./entity";

export class PlayerEntity extends Entity {
  constructor(
    public connection: Connection,
    public username: string,
    public uuid: string,
    world: World
  ) {
    super(world)
  }
}