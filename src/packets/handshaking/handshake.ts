import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class HandshakePacket implements Packet {
  constructor(
    public protocolVersion?: number,
    public address?: string,
    public port?: number,
    public nextState?: number
  ) {}

  getId(): number {
    return 0x00
  }
  
  getState(): State {
    return State.Handshaking
  }

  read(reader: BufferReader) {
    this.protocolVersion = reader.readVarInt()
    this.address = reader.readString()
    this.port = reader.readUnsignnedShort()
    this.nextState = reader.readVarInt()
  }

  write(writer: BufferWriter) {
  }
}