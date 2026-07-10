// Fait avancer `current` vers `target` à vitesse constante (unités/s), sans dépasser.
export const approach = (current: number, target: number, speed: number, deltaSeconds: number): number =>
  target > current
    ? Math.min(target, current + deltaSeconds * speed)
    : Math.max(target, current - deltaSeconds * speed)

// Interpolation d'angle par le chemin le plus court (wraparound sur ±π).
export const animateAngle = (current: number, target: number, speed: number, dt: number): number => {
  let delta = target - current
  while (delta > Math.PI) delta -= 2 * Math.PI
  while (delta < -Math.PI) delta += 2 * Math.PI
  if (Math.abs(delta) < 0.005) return target
  return current + delta * speed * dt
}

// Interpole deux couleurs hex (#rrggbb) selon t ∈ [0,1].
export const lerpHex = (a: string, b: string, t: number): string => {
  const ar = parseInt(a.slice(1, 3), 16), ag = parseInt(a.slice(3, 5), 16), ab2 = parseInt(a.slice(5, 7), 16)
  const br = parseInt(b.slice(1, 3), 16), bg = parseInt(b.slice(3, 5), 16), bb2 = parseInt(b.slice(5, 7), 16)
  const r = Math.round(ar + (br - ar) * t), g = Math.round(ag + (bg - ag) * t), b3 = Math.round(ab2 + (bb2 - ab2) * t)
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b3.toString(16).padStart(2, "0")}`
}
