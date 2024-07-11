export function distance(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
  return Math.sqrt(distanceSqaured(x1, y1, z1, x2, y2, z2))
}

export function distanceSqaured(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  const dz = z2 - z1

  return dx * dx + dy * dy + dz * dz
}