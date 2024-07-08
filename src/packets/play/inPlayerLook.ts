import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class InPlayerLookPacket implements Packet {
  public yaw: number
  public pitch: number
  public ground: boolean

  getId(): number {
    return 0x05
  }

  getState(): State {
    return State.Play
  }

  read(reader: BufferReader): void {
    this.yaw = reader.readFloat()
    this.pitch = reader.readFloat()
    this.ground = reader.readBoolean()
  }

  write(writer: BufferWriter): void {
  }
}