<template>
  <!-- ══ MODAL MODE — backdrop + centred card ══════════════════════════════ -->
  <Teleport v-if="isModal" to="body">
    <Transition name="gc-backdrop">
      <div
        v-if="isOpen"
        class="gc-backdrop"
        aria-modal="true"
        role="dialog"
        aria-label="Football goal CAPTCHA verification"
        @click.self="onBackdropClick"
      >
        <div class="gc-modal" :class="[`gc-modal--${theme}`, `gc-modal--${difficulty}`]" :data-state="state">
          <CaptchaCard
            :state="state"
            :captcha-data="captchaData"
            :current-ball-x="currentBallX"
            :error-msg="errorMsg"
            :closable="closable"
            :field-name="fieldName"
            :token="token"
            @close="closeModal"
            @load="load"
            @retry="retry"
            @drag-start="onDragStart"
            @drag-move="handleDragMove"
            @drag-end="handleDragEnd"
          />
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ══ INLINE MODE — renders in-place inside the page / form ════════════ -->
  <div
    v-else
    class="gc-modal"
    :class="[`gc-modal--${theme}`, `gc-modal--${difficulty}`]"
    :data-state="state"
  >
    <CaptchaCard
      :state="state"
      :captcha-data="captchaData"
      :current-ball-x="currentBallX"
      :error-msg="errorMsg"
      :closable="false"
      :field-name="fieldName"
      :token="token"
      @load="load"
      @retry="retry"
      @drag-start="onDragStart"
      @drag-move="handleDragMove"
      @drag-end="handleDragEnd"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, defineComponent, h } from 'vue'
import GoalCanvas from './GoalCanvas.vue'
import GoalSlider from './GoalSlider.vue'
import { useGoalCaptcha } from '../composables/useGoalCaptcha.js'

// ─── Props ────────────────────────────────────────────────────────────────

const props = defineProps({
  /** 'inline' renders inside the page; 'modal' opens as an overlay. */
  mode: {
    type:    String,
    default: 'inline',
    validator: (v) => ['inline', 'modal'].includes(v),
  },
  /**
   * Modal mode only: CSS selector or HTMLFormElement of the form to intercept.
   * When the form's submit event fires, the modal opens instead.
   * On successful verify, the form is submitted automatically.
   */
  form: {
    type:    String,
    default: null,
  },
  generateUrl: {
    type:    String,
    default: () => window.__GoalCaptchaConfig?.generateUrl ?? '/_goal_captcha/generate',
  },
  verifyUrl: {
    type:    String,
    default: () => window.__GoalCaptchaConfig?.verifyUrl ?? '/_goal_captcha/verify',
  },
  fieldName: {
    type:    String,
    default: 'captcha_token',
  },
  theme: {
    type:    String,
    default: () => window.__GoalCaptchaConfig?.theme ?? 'football',
  },
  difficulty: {
    type:    String,
    default: () => window.__GoalCaptchaConfig?.difficulty ?? 'medium',
  },
  autoLoad: {
    type:    Boolean,
    default: true,
  },
  closable: {
    type:    Boolean,
    default: true,
  },
})

// ─── Emits ────────────────────────────────────────────────────────────────

const emit = defineEmits(['verified', 'failed', 'loaded', 'close', 'open'])

// ─── Mode helpers ─────────────────────────────────────────────────────────

const isModal = computed(() => props.mode === 'modal')
const isOpen  = ref(false)

let interceptedForm = null   // the <form> element we're intercepting (modal mode)

function openModal() {
  isOpen.value = true
  emit('open')
  // Load fresh challenge each time the modal opens
  if (!captchaData.value || state.value === 'failed') retry()
  else if (state.value === 'idle') load()
}

function closeModal() {
  isOpen.value = false
  emit('close')
}

function onBackdropClick() {
  if (props.closable) closeModal()
}

// ─── Composable ───────────────────────────────────────────────────────────

const {
  state,
  token,
  errorMsg,
  captchaData,
  load,
  onDragStart,
  onDragMove,
  onDragEnd,
  retry,
} = useGoalCaptcha(props.generateUrl, props.verifyUrl)

// ─── Canvas sync ──────────────────────────────────────────────────────────

const currentBallX = ref(null)

function handleDragMove(ballPos, rawPos) {
  currentBallX.value = ballPos
  onDragMove(rawPos ?? ballPos)
}

function handleDragEnd(x) {
  currentBallX.value = x
  onDragEnd(x)
}

// ─── Side-effects ──────────────────────────────────────────────────────────

watch(state, (s) => {
  if (s === 'success') {
    currentBallX.value = captchaData.value?.target_x ?? currentBallX.value
    emit('verified', token.value)

    if (isModal.value && interceptedForm) {
      // Inject the token into the form then submit it natively
      closeModal()
      let hidden = interceptedForm.querySelector(`input[name="${props.fieldName}"]`)
      if (!hidden) {
        hidden = document.createElement('input')
        hidden.type = 'hidden'
        hidden.name = props.fieldName
        interceptedForm.appendChild(hidden)
      }
      hidden.value = token.value
      // Small delay so the success state is visible briefly
      setTimeout(() => interceptedForm.submit(), 600)
    }
  }
  if (s === 'failed') {
    emit('failed', errorMsg.value)
    if (captchaData.value) {
      setTimeout(() => {
        currentBallX.value = null
        retry()
      }, 1400)
    }
  }
  if (s === 'ready') emit('loaded', captchaData.value)
})

onMounted(() => {
  if (isModal.value) {
    // Intercept the target form's submit
    if (props.form) {
      interceptedForm =
        typeof props.form === 'string'
          ? document.querySelector(props.form)
          : props.form

      if (interceptedForm) {
        interceptedForm.addEventListener('submit', (e) => {
          if (interceptedForm.dataset.gcVerified === '1') return   // allow native re-submit
          e.preventDefault()
          openModal()
        })
      }
    }
    // Pre-load so the challenge is ready when the modal opens
    if (props.autoLoad) load()
  } else {
    if (props.autoLoad) load()
  }
})

// Allow parent to programmatically open/close (e.g. Inertia / SPA forms)
defineExpose({ open: openModal, close: closeModal })

// ─── CaptchaCard — internal sub-component ─────────────────────────────────
// Extracted so both modal and inline modes share the same inner markup.

const CaptchaCard = defineComponent({
  name: 'CaptchaCard',
  props: {
    state:        String,
    captchaData:  Object,
    currentBallX: Number,
    errorMsg:     String,
    closable:     Boolean,
    fieldName:    String,
    token:        String,
  },
  emits: ['close', 'load', 'retry', 'drag-start', 'drag-move', 'drag-end'],
  setup(p, { emit: ce }) {
    return () => [
      // ── Header
      h('div', { class: 'gc-modal__header' }, [
        h('div', { class: 'gc-modal__header-text' }, [
          h('h2', { class: 'gc-modal__title' }, "Confirm you're not a robot"),
          h('p',  { class: 'gc-modal__subtitle' }, 'Drag the slider to score a goal'),
        ]),
        p.closable
          ? h('button', {
              type: 'button', class: 'gc-modal__close', 'aria-label': 'Close',
              onClick: () => ce('close'),
            }, [
              h('svg', { viewBox: '0 0 24 24', width: 18, height: 18, fill: 'none', stroke: 'currentColor', 'stroke-width': '2.5', 'stroke-linecap': 'round' }, [
                h('line', { x1: 18, y1: 6,  x2: 6,  y2: 18 }),
                h('line', { x1: 6,  y1: 6,  x2: 18, y2: 18 }),
              ]),
            ])
          : null,
      ]),

      // ── Scene
      h('div', { class: 'gc-modal__scene' }, [
        p.state === 'loading'
          ? h('div', { class: 'gc-modal__skeleton', 'aria-busy': 'true' })
          : p.captchaData
            ? [
                h(GoalCanvas, {
                  captchaData:  p.captchaData,
                  ballX:        p.currentBallX,
                  showSuccess:  p.state === 'success',
                }),
                p.state === 'verifying'
                  ? h('div', { class: 'gc-modal__verifying', 'aria-live': 'polite' }, [
                      h('span', { class: 'gc-spinner', 'aria-hidden': 'true' }),
                      h('span', {}, 'Verifying…'),
                    ])
                  : null,
                p.state === 'failed'
                  ? h('div', { class: 'gc-modal__verifying gc-modal__verifying--failed', 'aria-live': 'assertive' }, [
                      h('span', { class: 'gc-icon-miss', 'aria-hidden': 'true' }, '❌'),
                      h('span', {}, 'Missed! Retrying…'),
                    ])
                  : null,
              ]
            : p.state === 'failed'
              ? h('div', { class: 'gc-modal__error-scene', role: 'alert' }, [
                  h('div', { class: 'gc-modal__error-icon', 'aria-hidden': 'true' }, '⚽'),
                  h('p',   { class: 'gc-modal__error-msg' }, p.errorMsg ?? 'Verification failed. Please try again.'),
                ])
              : h('div', { class: 'gc-modal__idle' }, [
                  h('button', { type: 'button', class: 'gc-btn-primary', onClick: () => ce('load') }, 'Start Verification'),
                ]),
      ]),

      // ── Slider
      h('div', { class: 'gc-modal__slider-wrap' }, [
        p.captchaData
          ? h(GoalSlider, {
              ballStartX:   p.captchaData.ball_start_x,
              trackWidth:   p.captchaData.canvas?.width ?? 400,
              success:      p.state === 'success',
              disabled:     p.state === 'verifying' || p.state === 'success',
              onDragStart:  () => ce('drag-start'),
              onDragMove:   (a, b) => ce('drag-move', a, b),
              onDragEnd:    (x) => ce('drag-end', x),
            })
          : p.state === 'loading'
            ? h('div', { class: 'gc-modal__slider-skeleton' })
            : h('div', { class: 'gc-modal__error-actions' }, [
                h('button', { type: 'button', class: 'gc-btn-primary', onClick: () => ce('retry') }, '↺ Try again'),
              ]),
      ]),

      // ── Hidden token (inline mode — appended to surrounding form)
      p.token
        ? h('input', { type: 'hidden', name: p.fieldName, value: p.token })
        : null,
    ]
  },
})
</script>

<style>
/* ── Modal card ───────────────────────────────────────────────────────────── */
.gc-modal {
  position:      relative;
  width:         100%;
  max-width:     440px;
  background:    #ffffff;
  border-radius: 16px;
  overflow:      hidden;
  font-family:   system-ui, -apple-system, 'Segoe UI', sans-serif;
  box-shadow:    0 8px 40px rgba(0,0,0,.16), 0 2px 8px rgba(0,0,0,.06);
  color:         #111827;
}

/* ── Header ───────────────────────────────────────────────────────────────── */
.gc-modal__header {
  display:         flex;
  align-items:     flex-start;
  justify-content: space-between;
  padding:         16px 16px 12px 20px;
  gap:             8px;
}
.gc-modal__header-text { flex: 1; min-width: 0; }
.gc-modal__title {
  margin:      0 0 4px;
  font-size:   1.0625rem;
  font-weight: 700;
  color:       #111827;
  line-height: 1.3;
}
.gc-modal__subtitle {
  margin:    0;
  font-size: 0.875rem;
  color:     #6b7280;
  line-height: 1.4;
}
.gc-modal__close {
  flex-shrink:     0;
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           32px;
  height:          32px;
  border:          none;
  background:      transparent;
  border-radius:   8px;
  color:           #9ca3af;
  cursor:          pointer;
  transition:      background .15s, color .15s;
  margin-top:      -2px;
}
.gc-modal__close:hover { background: #f3f4f6; color: #111827; }

/* ── Scene wrapper ────────────────────────────────────────────────────────── */
.gc-modal__scene {
  position: relative;
  width:    100%;
  line-height: 0;
}

/* ── Skeleton ─────────────────────────────────────────────────────────────── */
.gc-modal__skeleton {
  height:          220px;
  background:      linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation:       gc-shimmer 1.4s infinite;
}

/* ── Error scene ──────────────────────────────────────────────────────────── */
.gc-modal__error-scene {
  height:          220px;
  display:         flex;
  flex-direction:  column;
  align-items:     center;
  justify-content: center;
  gap:             12px;
  background:      #fff5f5;
  line-height:     1.5;
}
.gc-modal__error-icon { font-size: 2.75rem; }
.gc-modal__error-msg  {
  font-size:  .875rem;
  color:      #dc2626;
  margin:     0;
  text-align: center;
  padding:    0 24px;
}

/* ── Idle ─────────────────────────────────────────────────────────────────── */
.gc-modal__idle {
  height:          220px;
  display:         flex;
  align-items:     center;
  justify-content: center;
  background:      #f9fafb;
  line-height:     1.5;
}

/* ── Verifying overlay ────────────────────────────────────────────────────── */
.gc-modal__verifying {
  position:        absolute;
  inset:           0;
  background:      rgba(255,255,255,.72);
  display:         flex;
  align-items:     center;
  justify-content: center;
  gap:             10px;
  font-size:       .9rem;
  font-weight:     600;
  color:           #374151;
  backdrop-filter: blur(3px);
}
.gc-modal__verifying--failed {
  background: rgba(254,226,226,.82);
  color:      #b91c1c;
  animation:  gc-fail-fade 1.4s ease forwards;
}
.gc-icon-miss { font-size: 1.2rem; line-height: 1; }
@keyframes gc-fail-fade {
  0%   { opacity: 1; }
  70%  { opacity: 1; }
  100% { opacity: 0; }
}
.gc-spinner {
  width:            20px;
  height:           20px;
  border:           3px solid rgba(55,65,81,.15);
  border-top-color: #374151;
  border-radius:    50%;
  animation:        gc-spin .7s linear infinite;
  display:          inline-block;
}

/* ── Slider wrap ──────────────────────────────────────────────────────────── */
.gc-modal__slider-wrap {
  padding:    10px 12px 14px;
  background: #ffffff;
}
.gc-modal__slider-skeleton {
  height:          54px;
  background:      linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation:       gc-shimmer 1.4s infinite;
  border-radius:   12px;
}
.gc-modal__error-actions {
  display:         flex;
  justify-content: center;
  padding:         6px 0;
}

/* ── Buttons ──────────────────────────────────────────────────────────────── */
.gc-btn-primary {
  padding:       10px 28px;
  background:    #2563eb;
  color:         #fff;
  border:        none;
  border-radius: 8px;
  font-size:     .9rem;
  font-weight:   600;
  cursor:        pointer;
  transition:    opacity .2s, transform .1s;
}
.gc-btn-primary:hover  { opacity: .9; }
.gc-btn-primary:active { transform: scale(.97); }

/* ── Keyframes ────────────────────────────────────────────────────────────── */
@keyframes gc-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes gc-spin {
  to { transform: rotate(360deg); }
}

/* keep old class names working for any external references */
.goal-captcha { display: contents; }

/* ── Backdrop (modal mode) ────────────────────────────────────────────────── */
.gc-backdrop {
  position:        fixed;
  inset:           0;
  z-index:         9999;
  display:         flex;
  align-items:     center;
  justify-content: center;
  padding:         16px;
  background:      rgba(0, 0, 0, .55);
  backdrop-filter: blur(3px);
}
.gc-backdrop-enter-active { transition: opacity .25s ease; }
.gc-backdrop-leave-active { transition: opacity .2s ease; }
.gc-backdrop-enter-from,
.gc-backdrop-leave-to     { opacity: 0; }
.gc-backdrop-enter-active .gc-modal { animation: gc-modal-in .28s cubic-bezier(.175,.885,.32,1.275) both; }
.gc-backdrop-leave-active .gc-modal { animation: gc-modal-out .2s ease forwards; }
@keyframes gc-modal-in  { from { transform: scale(.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes gc-modal-out { to   { transform: scale(.94); opacity: 0; } }
</style>
