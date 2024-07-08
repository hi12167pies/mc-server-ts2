export class BufferReader {
  private index = 0
  constructor(
    public buffer: Buffer
  ) {}

  readVarInt(): number {
    let value = 0
    // 4 is max length of varint, so if its above just ignore
    for (let i = 0; i < 4; i++) {
      if (this.buffer[this.index] == undefined) throw new Error("Attempted to read out of range")
      value |= (this.buffer[this.index] & 0x7F) << i * 7
      this.index++
      if ((this.buffer[this.index] & 0x80) == 0) break;
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

  readUnsignnedShort(): number {
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
}