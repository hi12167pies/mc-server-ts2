import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { toFixedNumber } from "../../utils/typeUtil";
import { Packet } from "../packet";

export class OutRelativeMovePacket implements Packet {
  constructor(
    public eid: number,
    public x: number,
    public y: number,
    public z: number,
    public lastX: number,
    public lastY: number,
    public lastZ: number,
    public ground: boolean
  ) {}

  getId(): number {
    return 0x15
  }

  getState(): State {
    return State.Play
  }

  read(reader: BufferReader): void {
  }

  write(writer: BufferWriter): void {
    writer.writeVarInt(this.eid)
    writer.writeByte(toFixedNumber(this.x) - toFixedNumber(this.lastX))
    writer.writeByte(toFixedNumber(this.y) - toFixedNumber(this.lastY))
    writer.writeByte(toFixedNumber(this.z) - toFixedNumber(this.lastZ))
    writer.writeBoolean(this.ground)
  }
}