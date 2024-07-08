import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class InPlayerPositionPacket implements Packet {
  public x: number
  public y: number
  public z: number
  public ground: boolean

  getId(): number {
    return 0x04
  }

  getState(): State {
    return State.Play
  }

  read(reader: BufferReader): void {
    this.x = reader.readDouble()
    this.y = reader.readDouble()
    this.z = reader.readDouble()
    this.ground = reader.readBoolean()
  }

  write(writer: BufferWriter): void {
  }
}