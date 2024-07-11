import { BufferWriter } from "../buffer/bufferWriter"
import { MetadataIndex, MetadataType, OutEntityMetadataPacket } from "../packets/play/outEntityMetadata"
import { World } from "../world/world"

let globalEntityId = 0

export class Entity {  
  public eid: number = globalEntityId++
  
  public locX: number = 0
  public locY: number = 0
  public locZ: number = 0
  public yaw: number = 0
  public pitch: number = 0
  
  constructor(
    public world: World
  ) {}


  writeMetadata(writer: BufferWriter) {
    writeMetadataItem(writer, MetadataIndex.OuterSkinLayer, MetadataType.Byte, 127)

    // End of list
    writer.writeByte(127)
  }
}

function writeMetadataItem(writer: BufferWriter, index: MetadataIndex, type: MetadataType, value: any) {
  writer.writeByte(type >> 5 | (index & 31))

  switch (type) {
    case MetadataType.Byte:
      writer.writeByte(value)
      break
  }
}