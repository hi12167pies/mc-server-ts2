import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { Chat } from "../../chat/chat";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class OutPlayDisconnectPacket implements Packet {
  constructor(
    public reason: Chat
  ) {}

  getId(): number {
    return 0x40
  }

  getState(): State {
    return State.Play
  }
  
  read(reader: BufferReader): void {
  }
  
  write(writer: BufferWriter): void {
    writer.writeChat(this.reason)
  }
}