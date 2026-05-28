/**
 * Animation helpers — simple easing and RAF-based tweens.
 */

/**
 * Ease-out cubic — feels like slowing down naturally.
 * @param {number} t - Progress 0..1
 */
export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Animate a numeric value from `from` to `to` over `duration` ms.
 * @param {number}   from
 * @param {number}   to
 * @param {number}   duration  ms
 * @param {Function} onUpdate  called with current value each frame
 * @param {Function} [onDone]  called when complete
 * @returns {Function} cancel function
 */
export function tween(from, to, duration, onUpdate, onDone) {
  let start = null
  let rafId = null
  let cancelled = false

  function frame(timestamp) {
    if (cancelled) return

    if (start === null) start = timestamp

    const elapsed  = timestamp - start
    const progress = Math.min(elapsed / duration, 1)
    const value    = from + (to - from) * easeOutCubic(progress)

    onUpdate(value)

    if (progress < 1) {
      rafId = requestAnimationFrame(frame)
    } else {
      onDone?.()
    }
  }

  rafId = requestAnimationFrame(frame)

  return () => {
    cancelled = true
    if (rafId !== null) cancelAnimationFrame(rafId)
  }
}

/**
 * Simple bounce animation: ping-pong a value between min and max.
 * Useful for goalkeeper idle animation.
 *
 * @param {number}   min
 * @param {number}   max
 * @param {number}   period   ms for one full cycle
 * @param {Function} onUpdate called with current value
 * @returns {Function} stop function
 */
export function bounce(min, max, period, onUpdate) {
  let rafId  = null
  let active = true

  function frame(timestamp) {
    if (!active) return

    const progress = ((timestamp % period) / period) * Math.PI * 2
    const value    = min + (max - min) * (0.5 + 0.5 * Math.sin(progress))

    onUpdate(value)
    rafId = requestAnimationFrame(frame)
  }

  rafId = requestAnimationFrame(frame)

  return () => {
    active = false
    if (rafId !== null) cancelAnimationFrame(rafId)
  }
}
