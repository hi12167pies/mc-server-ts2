import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class InPlayerGroundPacket implements Packet {
  public ground: boolean
  getId(): number {
    return 0x03
  }
  
  getState(): State {
    return State.Play
  }

  read(reader: BufferReader): void {
    this.ground = reader.readBoolean()
  }
  
  write(writer: BufferWriter): void {
  }

}