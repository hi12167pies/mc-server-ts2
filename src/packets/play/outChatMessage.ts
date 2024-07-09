import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { Chat } from "../../chat/chat";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export enum ChatPosition {
  Chat = 0,
  System = 1,
  Hotbar = 2
}

export class OutChatMessagePacket implements Packet {
  constructor(
    public message: Chat,
    public position: ChatPosition
  ) {}

  getId(): number {
    return 0x02
  }

  getState(): State {
    return State.Play
  }
  
  read(reader: BufferReader): void {
  }
  
  write(writer: BufferWriter): void {
    writer.writeChat(this.message)
    writer.writeByte(this.position)
  }
}