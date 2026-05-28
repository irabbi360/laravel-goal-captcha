/**
 * GoalCaptcha Vite Plugin
 *
 * Resolves `@irabbi360/goal-captcha` to the package source inside vendor/,
 * so no separate `npm install` is needed in the host Laravel application.
 *
 * Usage — host app vite.config.js:
 *
 *   import goalCaptcha from './vendor/irabbi360/laravel-goal-captcha/vite-plugin.js'
 *
 *   export default defineConfig({
 *       plugins: [
 *           laravel({ input: [...] }),
 *           vue(),
 *           goalCaptcha(),
 *       ],
 *   })
 *
 * Then in Vue components:
 *   import { GoalCaptcha } from '@irabbi360/goal-captcha'
 *   import '@irabbi360/goal-captcha/style'
 */

import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dir      = dirname(__filename)

export default function goalCaptchaVitePlugin() {
    return {
        name: 'vite-plugin-goal-captcha',

        config() {
            return {
                resolve: {
                    alias: {
                        '@irabbi360/goal-captcha':
                            resolve(__dir, 'resources/js/index.js'),

                        '@irabbi360/goal-captcha/style':
                            resolve(__dir, 'resources/js/style.css'),
                    },
                },
                optimizeDeps: {
                    include: ['vue'],
                },
            }
        },
    }
}
