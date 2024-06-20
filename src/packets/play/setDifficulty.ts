import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { Difficulty } from "../../enum/difficulty";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class SetDifficultyPacket implements Packet {
  constructor(
    public difficulty: Difficulty
  ) {}

  getId(): number {
    return 0x41
  }
  
  getState(): State {
    return State.Play
  }
  
  read(reader: BufferReader): void {
  }
  
  write(writer: BufferWriter): void {
    writer.writeUnsignedByte(this.difficulty)
  }
}