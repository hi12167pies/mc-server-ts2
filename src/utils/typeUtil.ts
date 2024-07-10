export function toFixedNumber(value: number) {
  return Math.floor(value * 32)
}

export function toAngle(value: number) {
  return Math.floor(value * 256 / 360)
}