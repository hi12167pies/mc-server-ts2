import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { toAngle, toFixedNumber } from "../../utils/typeUtil";
import { Packet } from "../packet";

export class OutEntityTeleportPacket implements Packet {
  constructor(
    public entityId: number,
    public x: number,
    public y: number,
    public z: number,
    public yaw: number,
    public pitch: number,
    public ground: boolean,
  ) {}

  getId(): number {
    return 0x18
  }
  
  getState(): State {
    return State.Play
  }
  
  read(reader: BufferReader): void {
  }

  write(writer: BufferWriter): void {
    writer.writeVarInt(this.entityId)
    writer.writeInt(toFixedNumber(this.x))
    writer.writeInt(toFixedNumber(this.y))
    writer.writeInt(toFixedNumber(this.z))
    writer.writeUnsignedByte(toAngle(this.yaw)) // yaw
    writer.writeUnsignedByte(toAngle(this.pitch)) // pitch
    writer.writeBoolean(this.ground)
  }
}