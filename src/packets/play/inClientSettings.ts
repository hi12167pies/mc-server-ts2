import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export enum ClientSettingChatMode {
  Enabled = 0,
  CommandOnly = 1,
  Hidden = 2
}

export class InClientSettingsPacket implements Packet {
  public locale: string
  public viewDistance: number
  public chatMode: ClientSettingChatMode
  public chatColours: boolean
  public displayedSkinParts: number

  getId(): number {
    return 0x15
  }

  getState(): State {
    return State.Play
  }

  read(reader: BufferReader): void {
    this.locale = reader.readString()
    this.viewDistance = reader.readByte()
    this.chatMode = reader.readByte()
    this.chatColours = reader.readBoolean()
    this.displayedSkinParts = reader.readUnsignedByte()
  }
  
  write(writer: BufferWriter): void {
  }
}