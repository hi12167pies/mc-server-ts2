<<<<<<< HEAD
function a(value: number) {
  console.log(Math.floor(value * 256 / 360))
}

a(180)
a(4.0902228355407715)
=======
import { Difficulty } from "./src/enum/difficulty"
import { Dimension } from "./src/enum/dimension"
import { LevelType } from "./src/enum/levelType"
import { Chunk } from "./src/world/chunk"
import { World } from "./src/world/world"

const chunks: Set<Chunk> = new Set()

const world = new World(Dimension.Overworld, Difficulty.Easy, LevelType.flat)
for (let x = -32; x < 32; x++) {
  for (let z = -32; z < 32; z++) {
    const chunk = world.getChunkAt(x, z)
    chunks.add(chunk)
  }
}

console.log(chunks.size)
>>>>>>> abe2345d1a24600309d3ebd0dcd9efd41fb00700
