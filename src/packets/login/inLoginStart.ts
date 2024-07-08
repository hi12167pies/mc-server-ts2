import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class InLoginStartPacket implements Packet {
  username: string

  getId(): number {
    return 0x00
  }

  getState(): State {
    return State.Login
  }

  read(reader: BufferReader): void {
    this.username = reader.readString()
  }
  
  write(writer: BufferWriter): void {
  }
}