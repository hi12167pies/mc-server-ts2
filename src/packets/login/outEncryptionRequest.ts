import { KeyObject } from "crypto";
import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";
import { getPublicKeyBytes } from "../../utils/encryptionUtils";

export class OutEncryptionRequest implements Packet {
  constructor(
    public publicKey: Buffer,
    public verifyToken: Buffer
  ) {}

  getId(): number {
    return 0x01
  }

  getState(): State {
    return State.Login
  }
  
  read(reader: BufferReader): void {
  }
  
  write(writer: BufferWriter): void {
    writer.writeString("") // server id - wiki.vg says empty
    
    writer.writeVarInt(this.publicKey.length)
    writer.writerBuffer(this.publicKey)

    writer.writeVarInt(this.verifyToken.length)
    writer.writerBuffer(this.verifyToken)
  }
}