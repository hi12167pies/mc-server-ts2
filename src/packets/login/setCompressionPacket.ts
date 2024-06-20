import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class SetCompressionPacket implements Packet {
  constructor(
    public threshold: number
  ) {}

  getId(): number {
    return 0x03
  }

  getState(): State {
    return State.Login
  }

  read(reader: BufferReader): void {
    
  }
  
  write(writer: BufferWriter): void {
    writer.writeVarInt(this.threshold)
  }
}