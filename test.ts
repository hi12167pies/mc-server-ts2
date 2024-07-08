import { DynamicBuffer } from "dynamic-buffer";
import { Difficulty } from "./src/enum/difficulty";
import { Dimension } from "./src/enum/dimension";
import { chunkIntToPos } from "./src/utils/worldUtils";
import { World } from "./src/world/world";
import { BufferWriter } from "./src/buffer/bufferWriter";

// const world = new World(Dimension.Overworld, Difficulty.Easy)

// world.setBlockAt(16,16,16, { type: 6, data: 9 })


// for (const chunk of world.chunks.values()) {
//   for (const section of chunk.sections) {
//     for (const entry of section.blocks.entries()) {
//       const [x,y,z] = chunkIntToPos(entry[0])
//       const block = entry[1]

//       console.log(x,y,z,x + chunk.x,y + section.yLevel,z + chunk.z,block, chunk.x, section.yLevel, chunk.z)
//     }
//   }
// }

// const buffer1 = new DynamicBuffer()

// buffer1.write(Buffer.alloc(5).fill(1))

// console.log(buffer1.toBuffer())


const buff = Buffer.alloc(8192)