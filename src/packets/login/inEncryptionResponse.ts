import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class InEncryptionResponse implements Packet {
  public sharedSecret: Buffer
  public verifyToken: Buffer

  getId(): number {
    return 0x01
  }

  getState(): State {
    return State.Login
  }
  
  read(reader: BufferReader): void {
    const sharedSecretLength = reader.readVarInt()
    this.sharedSecret = reader.readBuffer(sharedSecretLength)

    const verifyTokenLength = reader.readVarInt()
    this.verifyToken = reader.readBuffer(verifyTokenLength)
  }
  
  write(writer: BufferWriter): void {
  }
}