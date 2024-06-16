import { BufferReader } from "../buffer/bufferReader";
import { BufferWriter } from "../buffer/bufferWriter";
import { State } from "../enum/state";

export interface Packet {
  getId(): number,
  getState(): State,
  read(reader: BufferReader): void;
  write(writer: BufferWriter): void;
}