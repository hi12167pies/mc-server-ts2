import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class OutEntityDestoryPacket implements Packet {
  constructor(
    public ids: number[]
  ) {}
  
  getId(): number {
    return 0x13
  }
  getState(): State {
    return State.Play
  }
  
  read(reader: BufferReader): void {
  }

  write(writer: BufferWriter): void {
    writer.writeVarInt(this.ids.length)
    for (let i = 0; i < this.ids.length; i++) {
      writer.writeVarInt(this.ids[i])
    }
  }
}