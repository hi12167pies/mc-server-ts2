import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class InPlayerPosLookPacket implements Packet {
  public x: number
  public y: number
  public z: number
  public yaw: number
  public pitch: number
  public ground: boolean

  getId(): number {
    return 0x06
  }

  getState(): State {
    return State.Play
  }

  read(reader: BufferReader): void {
    this.x = reader.readDouble()
    this.y = reader.readDouble()
    this.z = reader.readDouble()
    this.yaw = reader.readFloat()
    this.pitch = reader.readFloat()
    this.ground = reader.readBoolean()
  }

  write(writer: BufferWriter): void {
  }
}