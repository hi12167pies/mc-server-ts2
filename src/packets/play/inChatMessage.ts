import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class InChatMessagePacket implements Packet {
  public message: string

  getId(): number {
    return 0x01  
  }

  getState(): State {
    return State.Play
  }
  
  read(reader: BufferReader): void {
    this.message = reader.readString()
  }
  
  write(writer: BufferWriter): void {
  }
}