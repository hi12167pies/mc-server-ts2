import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class InStatusPingPacket implements Packet {
  payload: bigint

  getId(): number {
    return 0x01
  }

  getState(): State {
    return State.Status
  }

  read(reader: BufferReader): void {
    this.payload = reader.readLong()
  }

  write(writer: BufferWriter): void {
  }
}