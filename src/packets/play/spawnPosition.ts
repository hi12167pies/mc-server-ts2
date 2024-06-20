import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Position } from "../../position";
import { Packet } from "../packet";

export class SpawnPositionPacket implements Packet {
  constructor(
    public position: Position
  ) {}

  getId(): number {
    return 0x05
  }
  
  getState(): State {
    return State.Play
  }
  
  read(reader: BufferReader): void {
  }
  
  write(writer: BufferWriter): void {
    writer.writePosition(this.position)
  }
}