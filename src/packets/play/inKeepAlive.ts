import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class InKeepAlivePacket implements Packet {
  public id: number

  getId(): number {
    return 0x00
  }

  getState(): State {
    return State.Play
  }

  read(reader: BufferReader): void {
    this.id = reader.readVarInt()
  }

  write(writer: BufferWriter): void {
  }
}