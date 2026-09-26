// Maps `value` from [inMin, inMax] to [0, 1], clamped at the edges.
export function mapRange(value, inMin, inMax) {
  if (inMax === inMin) return value >= inMax ? 1 : 0;
  const t = (value - inMin) / (inMax - inMin);
  return Math.min(Math.max(t, 0), 1);
}

// Triangular pulse that peaks at `center` and fades to 0 over `width` on
// either side — used to fire particle bursts right at a transition point.
export function pulse(value, center, width) {
  const dist = Math.abs(value - center);
  return Math.max(1 - dist / width, 0);
}
