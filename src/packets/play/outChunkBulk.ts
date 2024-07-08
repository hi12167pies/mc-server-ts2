import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { Dimension } from "../../enum/dimension";
import { State } from "../../enum/state";
import { loggerDebug } from "../../utils/logger";
import { chunkIntToPos } from "../../utils/worldUtils";
import { Chunk } from "../../world/chunk";
import { Packet } from "../packet";

export class OutChunkBulkPacket implements Packet {
  constructor(
    public dimension: Dimension,
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
    // wiki.vg - "Whether or not Chunk Data contains light nibble arrays. This is true in the Overworld, false in the End + Nether"
    writer.writeBoolean(this.dimension == Dimension.Overworld)

    // chunk count
    writer.writeVarInt(this.chunks.length)

    // buffer that we can concat
    let finalBuffer = Buffer.alloc(0)

    // chunk meta
    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i]

      // chunk position
      writer.writeInt(chunk.x)
      writer.writeInt(chunk.z)

      // bitmask containing if the section contains air or not (if it's empty)
      let bitmask = 0

      // final sections to be sent
      let sections = []

      for (let i = 0; i < Chunk.SECTIONS; i++) {
        const section = chunk.sections[i]
        if (section.blocks.size <= 0) continue
        // if the chunk is not empty
        bitmask |= 1 << i
        sections.push(section)
      }

      writer.writeUnsignedShort(bitmask)

      // remove 1 because length is always +1
      const sectionCount = sections.length

      // create array for block data
      let blockData = Buffer.alloc(8192 * sectionCount).fill(0)

      // loop over included sections
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]

        // loop over all entries
        const entries = section.blocks.entries()
        for (const entry of entries) {
          const [x, y, z] = chunkIntToPos(entry[0])
 
          // get index in array
          const index = (y << 8 | z << 4 | x) + (8192 * i)
          const block = entry[1]

          blockData[2 * index] = ((block.type << 4) | block.data)
          blockData[2 * index + 1] = block.type >> 4
        }
      }
      const lightBuffer = Buffer.alloc(2048 * sectionCount).fill(0xFF)

      finalBuffer = Buffer.concat([
        finalBuffer, blockData,
        // block light
        lightBuffer,
        // sky light
        lightBuffer,
        // biomes
        Buffer.alloc(256).fill(0)
      ])
    }

    writer.writerBuffer(finalBuffer)
  }
}