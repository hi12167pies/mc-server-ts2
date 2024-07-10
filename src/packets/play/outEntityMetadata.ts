import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { Entity } from "../../entity/entity";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export enum MetadataIndex {
  OuterSkinLayer = 10
}

export enum MetadataType {
  Byte = 0
}

export class OutEntityMetadataPacket implements Packet {
  constructor(
    public entity: Entity
  ) {}

  getId(): number {
    return 0x1C
  }

  getState(): State {
    return State.Play
  }

  read(reader: BufferReader): void {
  }
  
  write(writer: BufferWriter): void {
    writer.writeVarInt(this.entity.eid)
    
<<<<<<< HEAD
    this.entity.writeMetadata(writer)
=======
    this.entity.writeMetadata(writer, this)
  }

  writeItem(writer: BufferWriter, index: MetadataIndex, type: MetadataType, value: any) {
    writer.writeByte(type >> 5 | (index & 31))

    switch (type) {
      case MetadataType.Byte:
        writer.writeByte(value)
        break
    }
>>>>>>> abe2345d1a24600309d3ebd0dcd9efd41fb00700
  }
}