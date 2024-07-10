import { Chat } from "../chat/chat";
import { Connection } from "../connnection";
import { Gamemode } from "../enum/gamemode";
import { World } from "../world/world";
import { Entity } from "./entity";
import { Property } from "./properties";

export class PlayerEntity extends Entity {
  public properties: Map<string, Property[]> = new Map()
  public gamemode: Gamemode = Gamemode.Creative
  public ping: number = 0
  public displayName?: Chat

  constructor(
    public connection: Connection,
    public username: string,
    public uuid: string,
    world: World
  ) {
    super(world)
  }

  setProperty(property: Property) {
    if (!this.properties.has(property.name)) {
      this.properties.set(property.name, [])
    }
    const propertyList = this.properties.get(property.name)
    propertyList.push(property)
  }
}