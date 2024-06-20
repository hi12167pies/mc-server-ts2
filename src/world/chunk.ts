import { ChunkPosition, Position } from "../position"
import { Block } from "./block"

export class Chunk {
  public static SECTIONS = 16
  
  public sections: ChunkSection[] = new Array(Chunk.SECTIONS)
  
  constructor(
    public position: ChunkPosition
  ) {
    for (let i = 0; i < Chunk.SECTIONS; i++) {
      this.sections[i] = new ChunkSection()
    }
  }

  public setBlock(position: Position, block: Block) {
    const section = this.getSectionFromY(position.y)
    section.blocks.set(position, block)
  }

  public getSectionFromY(y: number) {
    return this.sections[ Math.floor(y / Chunk.SECTIONS) ]
  }
}

export class ChunkSection {
  public blocks: Map<Position, Block> = new Map()
}