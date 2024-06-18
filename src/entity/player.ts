import { Connection } from "../connnection";
import { PositionLook } from "../position";
import { Entity } from "./entity";

export class PlayerEntity extends Entity {
  constructor(
    public connection: Connection,
    public username: string,
    public uuid: string
  ) {
    super()
  }
}