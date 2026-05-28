/**
 * useGoalCaptcha composable
 *
 * Handles the full CAPTCHA lifecycle:
 *  1. Fetch a challenge from the generate endpoint
 *  2. Track user drag movement
 *  3. Post verification to the verify endpoint
 *  4. Emit a one-time token on success
 */

import { ref, readonly } from 'vue'
import { createMotionTracker } from '../utils/motionTracker.js'

/** @typedef {'idle'|'loading'|'ready'|'dragging'|'verifying'|'success'|'failed'} CaptchaState */

export function useGoalCaptcha(generateUrl, verifyUrl) {
  /** @type {import('vue').Ref<CaptchaState>} */
  const state       = ref('idle')
  const token       = ref(null)
  const errorMsg    = ref(null)
  const captchaData = ref(null)

  const motionTracker = createMotionTracker()

  // ─── Load challenge ───────────────────────────────────────────────────────

  async function load() {
    state.value    = 'loading'
    errorMsg.value = null
    token.value    = null

    try {
      const res  = await fetch(generateUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin',
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)

      captchaData.value = await res.json()
      state.value       = 'ready'
    } catch (err) {
      state.value    = 'failed'
      errorMsg.value = 'Failed to load CAPTCHA. Please refresh.'
      console.error('[GoalCaptcha] generate error:', err)
    }
  }

  // ─── Drag lifecycle ───────────────────────────────────────────────────────

  function onDragStart() {
    if (state.value !== 'ready') return
    state.value = 'dragging'
    motionTracker.reset()
    motionTracker.start()
  }

  function onDragMove(x) {
    if (state.value !== 'dragging') return
    motionTracker.record(x)
  }

  async function onDragEnd(finalX) {
    if (state.value !== 'dragging') return

    motionTracker.stop()
    state.value = 'verifying'

    const track   = motionTracker.getTrack()
    const elapsed = motionTracker.getElapsed()

    try {
      const res = await fetch(verifyUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin',
        body: JSON.stringify({
          captcha_id:     captchaData.value.captcha_id,
          final_x:        Math.round(finalX),
          drag_time:      elapsed,
          movement_track: track,
        }),
      })

      const body = await res.json()

      if (body.success) {
        token.value = body.token
        state.value = 'success'
      } else {
        errorMsg.value = body.message ?? 'Verification failed.'
        state.value    = 'failed'
      }
    } catch (err) {
      state.value    = 'failed'
      errorMsg.value = 'Network error. Please try again.'
      console.error('[GoalCaptcha] verify error:', err)
    }
  }

  // ─── Retry ────────────────────────────────────────────────────────────────

  async function retry() {
    motionTracker.reset()
    await load()
  }

  return {
    state:       readonly(state),
    token:       readonly(token),
    errorMsg:    readonly(errorMsg),
    captchaData: readonly(captchaData),
    load,
    onDragStart,
    onDragMove,
    onDragEnd,
    retry,
  }
}
