import { posToChunkInt } from "../utils/worldUtils";
import { BlockData } from "./block";

export class Chunk {
  public static SECTIONS = 16
  
  public sections: ChunkSection[] = new Array(Chunk.SECTIONS)

  private xAbsolute: number
  private zAbsolute: number

  constructor(
    public x: number,
    public z: number
  ) {
    this.xAbsolute = x * 16
    this.zAbsolute = z * 16
    for (let i = 0; i < Chunk.SECTIONS; i++) {
      this.sections[i] = new ChunkSection(i * Chunk.SECTIONS)
    }
  }

  getSectionFromY(y: number) {
    return this.sections[ Math.floor(y / Chunk.SECTIONS) ]
  }

  getBlockAt(x: number, y: number, z: number): BlockData | null {
    const section = this.getSectionFromY(y)
    return section.getBlockAtRelative(x - this.xAbsolute, y - section.yLevel, z - this.zAbsolute)
  }

  setBlockAt(x: number, y: number, z: number, block: BlockData) {
    const section = this.getSectionFromY(y)
    return section.setBlockAtRelative(x - this.xAbsolute, y - section.yLevel, z - this.zAbsolute, block)
  }
}

export class ChunkSection {
  constructor(
    public yLevel: number
  ) {}

  // sections are 16x16x16
  public blocks: Map<number, BlockData> = new Map()

  getBlockAtRelative(x: number, y: number, z: number): BlockData | null {
    return this.blocks.get(posToChunkInt(x, y, z)) || null
  }

  setBlockAtRelative(x: number, y: number, z: number, block: BlockData) {
    this.blocks.set(posToChunkInt(x, y, z), block)
  }
}