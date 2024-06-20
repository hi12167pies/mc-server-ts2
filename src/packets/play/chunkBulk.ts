import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { Dimension } from "../../enum/dimension";
import { State } from "../../enum/state";
import { Chunk } from "../../world/chunk";
import { World } from "../../world/world";
import { Packet } from "../packet";

export class ChunkBulkPacket implements Packet {
  constructor(
    public world: World,
    public chunks: Chunk[]
  ) {}

  getId(): number {
    return 0x26
  }

  getState(): State {
    return State.Play
  }
  
  read(reader: BufferReader): void {
  }
  
  write(writer: BufferWriter): void {
    // wiki - "Whether or not Chunk Data contains light nibble arrays. This is true in the Overworld, false in the End + Nether"
    writer.writeBoolean(this.world.dimension == Dimension.Overworld)

    writer.writeVarInt(this.chunks.length)

    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i]

      // chunk position
      writer.writeInt(chunk.position.x)
      writer.writeInt(chunk.position.z)

      // write bitmask - if section has air or not
      let mask = 0
      let sectionCount = 0

      for (let i = 0; i < Chunk.SECTIONS; i++) {
        if (chunk.sections[i].blocks.size <= 0) continue
        mask |= 1 << i
        sectionCount++
      }

      writer.writeUnsignedShort(mask)

      // block data
      const blockData = new Array(8192 * sectionCount).fill(0) // array starts with all 0's for air

      for (let i = 0; i < Chunk.SECTIONS; i++) {
        if (chunk.sections[i].blocks.size <= 0) continue
        const section = chunk.sections[i]

        // loop over all blocks in section
        for (const position of section.blocks.keys()) {

          const block = section.blocks.get(position)
          if (block == undefined) return
          
          const i = position.y << 8 | position.z << 4 | position.x

          blockData[2 * i]  = ((block.type << 4) | block.meta)
          blockData[2 * i + 1]  = block.type >> 4

        }
      }
      writer.writeUnsignedByteArray(blockData)

      // block light
      const blockLight = new Array(2048 * sectionCount).fill(0xff)
      writer.writeUnsignedByteArray(blockLight)

      // skylight
      const skyLight = new Array(2048 * sectionCount).fill(0xff)
      writer.writeUnsignedByteArray(skyLight)

      // biomes
      const biomes = new Array(256).fill(0)
      writer.writeUnsignedByteArray(biomes)
    }
  }
}