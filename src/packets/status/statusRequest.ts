import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class StatusRequestPacket implements Packet {
  getId(): number {
    return 0x00
  }
  
  getState(): State {
    return State.Status
  }

  read(reader: BufferReader): void {
  }

  write(writer: BufferWriter): void {
  }
}