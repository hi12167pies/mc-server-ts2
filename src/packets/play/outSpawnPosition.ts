import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class OutSpawnPositionPacket implements Packet {
  constructor(
    public x: number,
    public y: number,
    public z: number,
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
    writer.writePosition(this.x, this.y, this.z)
  }
}