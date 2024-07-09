import { Difficulty } from "../enum/difficulty";
import { Dimension } from "../enum/dimension";
import { LevelType } from "../enum/levelType";
import { chunkPosToBigInt } from "../utils/worldUtils";
import { BlockData } from "./block";
import { Chunk } from "./chunk";

export class World {
  constructor(
    public dimension: Dimension,
    public difficulty: Difficulty,
    public levelType: LevelType
  ) {}

  public spawnX: number = 0
  public spawnY: number = 0
  public spawnZ: number = 0

  public chunks: Map<bigint, Chunk> = new Map()

  getChunkAt(x: number, z: number): Chunk {
    const chunkX = Math.floor(x / 16) * 16
    const chunkZ = Math.floor(z / 16) * 16
    const chunkPos: bigint = chunkPosToBigInt(chunkX, chunkZ)
    if (this.chunks.has(chunkPos)) {
      return this.chunks.get(chunkPos)
    }
    const chunk = new Chunk(chunkX, chunkZ)
    this.chunks.set(chunkPos, chunk)
    return chunk
  }

  getBlockAt(x: number, y: number, z: number): BlockData {
    const chunk = this.getChunkAt(x, z)
    if (chunk == null) {
      return { type: 0, data: 0 }
    }

    return chunk.getBlockAt(x, y, z) || { type: 0, data: 0 }
  }

  setBlockAt(x: number, y: number, z: number, block: BlockData) {
    const chunk = this.getChunkAt(x, z)
    chunk.setBlockAt(x, y, z, block)
  }
}