import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class InPluginMessage implements Packet {
  public channel: string
  public data: Buffer

  getId(): number {
    return 0x17
  }

  getState(): State {
    return State.Play
  }

  read(reader: BufferReader): void {
    this.channel = reader.readString()
    this.data = reader.readRemainingBuffer()
  }

  write(writer: BufferWriter): void {
  }
}