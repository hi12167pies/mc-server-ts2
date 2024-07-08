import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class OutStatusPongPacket implements Packet {
  constructor(
    public payload: bigint
  ) {}

  getId(): number {
    return 0x01
  }

  getState(): State {
    return State.Status
  }

  read(reader: BufferReader): void {
  }

  write(writer: BufferWriter): void {
    writer.writeLong(this.payload)
  }
}