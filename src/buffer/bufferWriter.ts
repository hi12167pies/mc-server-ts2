import { DynamicBuffer } from "dynamic-buffer"
import { Chat } from "../chat/chat"

export class BufferWriter {
  private buffer: DynamicBuffer
  private index: number = 0

  constructor() {
    this.buffer = new DynamicBuffer()
  }

  writeVarInt(value: number) {
    while (true) {
      if ((value & ~0x7F) == 0) {
        this.buffer.writeUInt8(value, this.index)
        this.index++
        return
      }

      this.buffer.writeUInt8((value & 0x7F) | 0x80, this.index)
      this.index++

      value >>>= 7
    }
  }

  writeInt(value: number) {
    this.buffer.writeInt32BE(value, this.index)
    this.index += 4
  }

  writeUnsignedByte(value: number) {
    this.buffer.writeUInt8(value, this.index)
    this.index += 1
  }

  writeByte(value: number) {
    this.buffer.writeInt8(value, this.index)
    this.index += 1
  }

  writeBoolean(value: boolean) {
    this.buffer.writeUInt8(value ? 0x01 : 0x00, this.index)
    this.index += 1
  }

  writeString(string: string) {
    const utf8Buffer = Buffer.from(string, 'utf8')

    this.writeVarInt(utf8Buffer.length)
    
    for (let i = 0; i < utf8Buffer.length; i++) {
      this.buffer.writeUInt8(utf8Buffer[i], this.index)
      this.index++
    }
  }

  writeUnsignedShort(value: number) {
    this.buffer.writeUInt16BE(value, this.index)
    this.index += 2
  }

  writePosition(x: number, y: number, z: number) {
    const value: bigint = BigInt(
      ((x & 0x3FFFFFF) << 38) | ((z & 0x3FFFFFF) << 12) | (y & 0xFFF)
    )

    this.writeLong(value)
  }

  writeJson(json: any) {
    this.writeString(JSON.stringify(json))
  }

  writeChat(chat: Chat) {
    this.writeJson(chat.toJson())
  }

  writeLong(long: bigint) {
    this.buffer.writeBigInt64BE(long, this.index)
    this.index += 8
  }

  writerBuffer(buffer: Buffer) {
    this.buffer.write(buffer, this.index)
    this.index += buffer.byteLength
  }

  writeDouble(double: number) {
    this.buffer.writeDoubleBE(double, this.index)
    this.index += 8
  }

  writeFloat(float: number) {
    this.buffer.writeFloatBE(float, this.index)
    this.index += 4
  }

  writeUUID(uuid: string) {
    const uuidWithoutHyphens = uuid.replace(/-/g, '')

    // Note: UUID is in hex
    const msb = BigInt("0x" + uuidWithoutHyphens.substring(0, 16))
    const lsb = BigInt("0x" + uuidWithoutHyphens.substring(16, 32))

    this.buffer.writeBigUInt64BE(msb, this.index)
    this.index += 8

    this.buffer.writeBigUInt64BE(lsb, this.index)
    this.index += 8
  }

  getBuffer(): Buffer {
    return this.buffer.toBuffer()
  }
}