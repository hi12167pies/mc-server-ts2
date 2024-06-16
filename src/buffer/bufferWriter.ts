import { DynamicBuffer } from "dynamic-buffer"

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

  writeString(string: string) {
    const utf8Buffer = Buffer.from(string, 'utf8')

    this.writeVarInt(utf8Buffer.length)
    
    for (let i = 0; i < utf8Buffer.length; i++) {
      this.buffer.writeUInt8(utf8Buffer[i], this.index)
      this.index++
    }
  }

  writeJson(json: any) {
    this.writeString(JSON.stringify(json))
  }

  writeLong(long: bigint) {
    this.buffer.writeBigInt64BE(long, this.index)
    this.index += 8
  }

  getBuffer(): Buffer {
    return this.buffer.toBuffer()
  }
}