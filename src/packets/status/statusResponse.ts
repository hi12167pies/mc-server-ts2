import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { Chat } from "../../chat/chat";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export type PlayerSample = {
  name: string,
  id: string
}

export type StatusResponseData = {
  version: {
    name: string,
    protocol: number
  },
  players: {
    max: number,
    online: number,
    sample: PlayerSample[]
  },
  description: Chat
  favicon?: string
}

export class StatusResponsePacket implements Packet {
  constructor(
    public data: StatusResponseData
  ) {}

  getId(): number {
    return 0x00
  }
  
  getState(): State {
    return State.Status
  }

  read(reader: BufferReader): void {
  }

  write(writer: BufferWriter): void {
    writer.writeJson(this.data)
  }
}