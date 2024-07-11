export function toFixedNumber(value: number) {
  return Math.floor(value * 32)
}

export function clamp(value: number, min: number, max: number) {
  if (value > max) return max
  if (value < min) return min
  return value
}

export function toAngle(value: number) { 
  return Math.trunc(clamp(value, 0, 360) / 360) * 127
}