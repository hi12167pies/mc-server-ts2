import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { toFixedNumber } from "../../utils/typeUtil";
import { Packet } from "../packet";

export class OutRelativeMovePacket implements Packet {
  constructor(
    public eid: number,
    public deltaX: number,
    public deltaY: number,
    public deltaZ: number,
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
    writer.writeByte(toFixedNumber(this.deltaX))
    writer.writeByte(toFixedNumber(this.deltaY))
    writer.writeByte(toFixedNumber(this.deltaZ))
    writer.writeBoolean(this.ground)
  }
}