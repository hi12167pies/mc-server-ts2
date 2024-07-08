import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class OutPlayerPosLookPacket implements Packet {
  constructor(
    public x: number,
    public y: number,
    public z: number,
    public yaw: number,
    public pitch: number,
  ) {}

  getId(): number {
    return 0x08
  }

  getState(): State {
    return State.Play
  }

  read(reader: BufferReader): void {
  }

  write(writer: BufferWriter): void {
    writer.writeDouble(this.x)
    writer.writeDouble(this.y)
    writer.writeDouble(this.z)
    writer.writeFloat(this.yaw)
    writer.writeFloat(this.pitch)
    writer.writeByte(0) // relative bitflag - https://wiki.vg/index.php?title=Protocal&oldid=7407#Player_Position_And_Look
  }
}