export type Position = {
  x: number,
  y: number,
  z: number
}

export type ChunkPosition = {
  x: number,
  z: number
}

export type PositionLook = Position & {
  yaw: number,
  pitch: number
}