import { BufferWriter } from "../buffer/bufferWriter"
import { MetadataIndex, MetadataType, OutEntityMetadataPacket } from "../packets/play/outEntityMetadata"
import { World } from "../world/world"
import { PlayerEntity } from "./player"

let globalEntityId = 0

export class Entity {  
  public eid: number = globalEntityId++
  
  public locX: number = 0
  public locY: number = 0
  public locZ: number = 0
  public yaw: number = 0
  public pitch: number = 0

  public sneaking: boolean
  public sprinting: boolean
  
  constructor(
    public world: World
  ) {}

  writeMetadata(writer: BufferWriter, packet: OutEntityMetadataPacket) {
    if (this instanceof PlayerEntity) {
      packet.writeItem(writer, MetadataIndex.OuterSkinLayer, MetadataType.Byte, 127)
    }

    // End of list
    writer.writeByte(127)
  }
}