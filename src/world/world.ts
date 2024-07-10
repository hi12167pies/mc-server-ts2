import { Difficulty } from "../enum/difficulty";
import { Dimension } from "../enum/dimension";
import { LevelType } from "../enum/levelType";
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

  public chunks: Set<Chunk> = new Set()

  getChunkAt(x: number, z: number): Chunk {
    const chunkX = Math.floor(x / 16)
    const chunkZ = Math.floor(z / 16)

    for (const chunk of this.chunks.values()) {
      if (chunk.x == chunkX && chunk.z == chunkZ) {
        return chunk
      }
    }

    const chunk = new Chunk(chunkX, chunkZ)
    this.chunks.add(chunk)
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