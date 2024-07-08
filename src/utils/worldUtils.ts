/**
 * @returns combined ints
 */
export function chunkPosToBigInt(x: number, z: number): bigint {
  return (BigInt(x) << 32n) | BigInt(z)
}

/**
 * @returns the int as [x, z]
 */
export function bigIntToChunkPos(int: bigint): [number, number] {
  const z = int & 0xFF_FF_FF_FFn
  const x = (int >> 32n) & 0xFF_FF_FF_FFn
  return [ Number(x), Number(z) ]
}

/**
 * @param x Must only be 0-255
 * @param y Must only be 0-255
 * @param z Must only be 0-255
 * @returns combined ints
 */
export function posToChunkInt(x: number, y: number, z: number): number {
  return (x << 16) | (y << 8) | z
}

/**
 * @returns the int as [x, y, z]
 */
export function chunkIntToPos(int: number): [number, number, number] {
  const z = int & 0xFF
  const y = (int >> 8) & 0xFF
  const x = (int >> 16) & 0xFF
  return [x, y, z]
}