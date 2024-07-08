export function readVarIntBuffer(buffer: Buffer, index: number) {
  let value = 0
  // 4 is max length of varint, so if its above just ignore
  for (let i = 0; i < 4; i++) {
    if (buffer[index] == undefined) throw new Error("Attempted to read too much data")
    value |= (buffer[index] & 0x7F) << i * 7
    index++
    if ((buffer[index] & 0x80) == 0) break;
  }
  return { value, index }
}