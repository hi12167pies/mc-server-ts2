import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class StatusPingPacket implements Packet {
  payload: bigint

  getId(): number {
    return 0x01
  }

  getState(): State {
    throw State.Status
  }

  read(reader: BufferReader): void {
    this.payload = reader.readLong()
  }

  write(writer: BufferWriter): void {
  }
}