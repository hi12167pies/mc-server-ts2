import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class InLoginSuccessPacket implements Packet {
  constructor(
    public username: string,
    public uuid: string
  ) {}

  getId(): number {
    return 0x02
  }

  getState(): State {
    return State.Login
  }

  read(reader: BufferReader): void {
  }
  
  write(writer: BufferWriter): void {
    writer.writeString(this.uuid)
    writer.writeString(this.username)
  }
}