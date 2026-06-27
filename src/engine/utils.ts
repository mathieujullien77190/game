export const rng = (seed: number, i: number): number => {
  const n = Math.sin(seed + i * 9301 + 49297) * 233280
  return n - Math.floor(n)
}
