import { BlockData } from "../world/block"

export type Item = BlockData & {
  name?: string
}


export class Inventory {
  public heldItem: Item
}