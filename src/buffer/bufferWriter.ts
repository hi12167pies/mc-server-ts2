import { DynamicBuffer } from "dynamic-buffer"
import { Position } from "../position"
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

  writeUnsignedByteArray(array: number[]) {
    for (let i = 0; i < array.length; i++) {
      this.buffer.writeUInt8(array[i], this.index)
      this.index++
    }
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
    this.buffer.writeInt32BE(value, this.index)
    this.index += 2
  }

  writePosition(position: Position) {
    const value: bigint = BigInt(
      ((position.x & 0x3FFFFFF) << 38) | ((position.z & 0x3FFFFFF) << 12) | (position.y & 0xFFF)
    )

    this.writeLong(value)
  }

  writeJson(json: any) {
    this.writeString(JSON.stringify(json))
  }

  writeChat(chat: Chat) {
    this.writeJson(chat.toString())
  }

  writeLong(long: bigint) {
    this.buffer.writeBigInt64BE(long, this.index)
    this.index += 8
  }

  getBuffer(): Buffer {
    return this.buffer.toBuffer()
  }
}