/**
 * Simple physics helpers for optional ball momentum / bounce effects.
 * Not a full physics engine — just enough for visual flair.
 */

/**
 * Clamp a value between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Apply momentum: given a velocity (px/ms) and elapsed time,
 * returns the decayed velocity (simulates friction).
 *
 * @param {number} velocity    px/ms
 * @param {number} elapsed     ms
 * @param {number} friction    0..1 (higher = more friction)
 */
export function applyFriction(velocity, elapsed, friction = 0.92) {
  return velocity * Math.pow(friction, elapsed / 16) // normalised to 60 fps
}

/**
 * Project the next position based on velocity and elapsed time.
 *
 * @param {number} x        current x
 * @param {number} velocity px/ms
 * @param {number} elapsed  ms
 */
export function project(x, velocity, elapsed) {
  return x + velocity * elapsed
}

/**
 * Snap x to the nearest multiple of `snap` pixels.
 * Useful for snapping to the target ring on success.
 */
export function snapTo(x, target, snapRadius) {
  return Math.abs(x - target) <= snapRadius ? target : x
}
