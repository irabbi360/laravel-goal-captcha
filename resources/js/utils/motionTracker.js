/**
 * Motion Tracker Utility
 *
 * Records pointer/touch movement samples during a drag gesture
 * with high-resolution timestamps (performance.now).
 *
 * Output format (per sample):  { x: number, t: number }
 *   - x : horizontal position in pixels (relative to track element)
 *   - t : milliseconds since drag started
 */

export function createMotionTracker() {
  let track     = []
  let startTime = null
  let running   = false

  function reset() {
    track     = []
    startTime = null
    running   = false
  }

  function start() {
    startTime = performance.now()
    running   = true
  }

  /**
   * Record a single movement sample.
   * @param {number} x - Pointer X position relative to the drag container
   */
  function record(x) {
    if (!running || startTime === null) return

    const t = Math.round(performance.now() - startTime)

    // Throttle: ignore samples within 8 ms of the previous one
    if (track.length > 0 && t - track[track.length - 1].t < 8) return

    track.push({ x: Math.round(x), t })
  }

  function stop() {
    running = false
  }

  /** @returns {Array<{x: number, t: number}>} */
  function getTrack() {
    return [...track]
  }

  /** Total elapsed time in milliseconds (0 if not started). */
  function getElapsed() {
    if (startTime === null) return 0
    return Math.round(performance.now() - startTime)
  }

  return { reset, start, record, stop, getTrack, getElapsed }
}
