export class BufferReader {
  private index = 0
  constructor(
    public buffer: Buffer
  ) {}

  readBuffer(size: number) {
    const buffer = this.buffer.subarray(this.index, this.index + size)
    this.index += size
    return buffer
  }

  readVarInt(): number {
    let value = 0
    // 4 is max length of varint, so if its above just ignore
    for (let i = 0; i < 4; i++) {
      if (this.buffer[this.index] == undefined) throw new Error("Attempted to read out of range")
    
      value |= (this.buffer[this.index] & 0x7F) << i * 7

      if ((this.buffer[this.index] & 0x80) == 0) {
        this.index++
        break
      }

      this.index++
    }
    return value
  }

  readString(): string {
    const length = this.readVarInt()
    // get the buffer within the length
    const buffer = this.buffer.subarray(this.index, this.index + length)
    this.index += length
    return buffer.toString("utf8")
  }

  readUnsignedShort(): number {
    const short = this.buffer.readUInt16BE(this.index)
    this.index += 2
    return short
  }

  readLong(): bigint {
    const long = this.buffer.readBigInt64BE(this.index)
    this.index += 8
    return long
  }

  readDouble() {
    const double = this.buffer.readDoubleBE(this.index)
    this.index += 8
    return double
  }

  readFloat() {
    const float = this.buffer.readFloatBE(this.index)
    this.index += 4
    return float
  }

  readBoolean() {
    const boolean = this.buffer.readUint8(this.index) == 0x01
    this.index += 1
    return boolean
  }

  readByte() {
    const byte = this.buffer.readInt8(this.index)
    this.index += 1
    return byte
  }

  readUnsignedByte() {
    const byte = this.buffer.readUInt8(this.index)
    this.index += 1
    return byte
  }

  readRemainingBuffer() {
    return this.buffer.subarray(this.index, this.buffer.length)
  }
}