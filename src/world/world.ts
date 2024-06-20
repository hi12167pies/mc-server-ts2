import { Difficulty } from "../enum/difficulty";
import { Dimension } from "../enum/dimension";
import { ChunkPosition, Position } from "../position";
import { Block } from "./block";
import { Chunk } from "./chunk";

export class World {
  public chunks: Map<ChunkPosition, Chunk> = new Map()

  public spawn: Position = { x: 0, y: 0, z: 0 }

  constructor(
    public dimension: Dimension,
    public difficulty: Difficulty
  ) {}
  
  public setBlock(position: Position, block: Block) {
    this.getChunkAt(position).setBlock(position, block)
  }

  public getChunkAt(position: Position): Chunk {
    const chunkPos: ChunkPosition = {
      x: Math.floor(position.x / 16),
      z: Math.floor(position.z / 16)
    }
    if (!this.chunks.has(chunkPos)) {
      this.chunks.set(chunkPos, new Chunk(chunkPos))
    }
    const chunk = this.chunks.get(chunkPos)
    if (chunk == undefined) throw new Error("Failed to create chunk")
    return chunk
  }
}