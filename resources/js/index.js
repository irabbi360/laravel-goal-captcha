/**
 * GoalCaptcha — JS package entry point
 *
 * Exports:
 *  - GoalCaptcha        Vue component
 *  - GoalCanvas         Vue component
 *  - GoalSlider         Vue component
 *  - SuccessAnimation   Vue component
 *  - useGoalCaptcha     composable
 *  - install()          Vue plugin
 *  - initBladeMount()   automatic DOM mount helper (for Blade usage)
 */

import GoalCaptcha      from './components/GoalCaptcha.vue'
import GoalCanvas       from './components/GoalCanvas.vue'
import GoalSlider       from './components/GoalSlider.vue'
import SuccessAnimation from './components/SuccessAnimation.vue'
import { useGoalCaptcha } from './composables/useGoalCaptcha.js'

export { GoalCaptcha, GoalCanvas, GoalSlider, SuccessAnimation, useGoalCaptcha }

// ─── Vue Plugin ───────────────────────────────────────────────────────────

export const install = (app, options = {}) => {
  // Allow override of default URLs via plugin options
  if (options.generateUrl || options.verifyUrl) {
    window.__GoalCaptchaConfig = {
      generateUrl: options.generateUrl ?? '/_goal_captcha/generate',
      verifyUrl:   options.verifyUrl   ?? '/_goal_captcha/verify',
      theme:       options.theme       ?? 'football',
      difficulty:  options.difficulty  ?? 'medium',
    }
  }

  app.component('GoalCaptcha',      GoalCaptcha)
  app.component('GoalCanvas',       GoalCanvas)
  app.component('GoalSlider',       GoalSlider)
  app.component('SuccessAnimation', SuccessAnimation)
}

export default { install }

// ─── Blade Auto-Mount ─────────────────────────────────────────────────────

/**
 * Automatically mounts GoalCaptcha on all elements with the
 * `id="goal-captcha-app"` attribute (inserted by the Blade component).
 *
 * Call this in your app.js / bootstrap.js:
 *   import { initBladeMount } from '@irabbi360/goal-captcha'
 *   initBladeMount()
 */
export function initBladeMount() {
  if (typeof document === 'undefined') return

  document.addEventListener('DOMContentLoaded', () => {
    const { createApp } = window.Vue ?? require('vue')

    document.querySelectorAll('.goal-captcha-wrapper').forEach((wrapper) => {
      const mountEl    = wrapper.querySelector('#goal-captcha-app')
      if (!mountEl) return

      const tokenInput = wrapper.querySelector('input[type="hidden"]')
      const config     = {
        generateUrl: wrapper.dataset.generateUrl,
        verifyUrl:   wrapper.dataset.verifyUrl,
        theme:       wrapper.dataset.theme       ?? 'football',
        difficulty:  wrapper.dataset.difficulty  ?? 'medium',
        fieldName:   wrapper.dataset.fieldName   ?? 'captcha_token',
      }

      const app = createApp(GoalCaptcha, {
        ...config,
        onVerified: (token) => {
          if (tokenInput) tokenInput.value = token
        },
      })

      app.mount(mountEl)
    })
  })
}
