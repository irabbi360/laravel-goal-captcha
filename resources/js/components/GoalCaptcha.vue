<template>
  <div
    class="gc-modal"
    :class="[`gc-modal--${theme}`, `gc-modal--${difficulty}`]"
    :data-state="state"
    role="dialog"
    aria-modal="true"
    aria-label="Football goal CAPTCHA verification"
  >
    <!-- ── Header ────────────────────────────────────────────────── -->
    <div class="gc-modal__header">
      <div class="gc-modal__header-text">
        <h2 class="gc-modal__title">Confirm you're not a robot</h2>
        <p class="gc-modal__subtitle">Drag the slider left or right to score a goal</p>
      </div>
      <button
        v-if="closable"
        type="button"
        class="gc-modal__close"
        aria-label="Close"
        @click="$emit('close')"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- ── Canvas area ───────────────────────────────────────────── -->
    <div class="gc-modal__scene">
      <!-- Loading skeleton -->
      <div v-if="state === 'loading'" class="gc-modal__skeleton" aria-busy="true" />

      <!-- Active canvas (ready / dragging / verifying / success) -->
      <template v-else-if="captchaData">
        <GoalCanvas
          :captcha-data="captchaData"
          :ball-x="currentBallX"
          :show-success="state === 'success'"
        />
        <!-- Verifying overlay -->
        <div v-if="state === 'verifying'" class="gc-modal__verifying" aria-live="polite">
          <span class="gc-spinner" aria-hidden="true" />
          <span>Verifying…</span>
        </div>
        <!-- Failed overlay (auto-retries) -->
        <div v-if="state === 'failed'" class="gc-modal__verifying gc-modal__verifying--failed" aria-live="assertive">
          <span class="gc-icon-miss" aria-hidden="true">❌</span>
          <span>Missed! Retrying…</span>
        </div>
      </template>

      <!-- Error scene -->
      <div v-else-if="state === 'failed'" class="gc-modal__error-scene" role="alert">
        <div class="gc-modal__error-icon" aria-hidden="true">⚽</div>
        <p class="gc-modal__error-msg">{{ errorMsg ?? 'Verification failed. Please try again.' }}</p>
      </div>

      <!-- Idle -->
      <div v-else class="gc-modal__idle">
        <button type="button" class="gc-btn-primary" @click="load">Start Verification</button>
      </div>
    </div>

    <!-- ── Slider area ───────────────────────────────────────────── -->
    <div class="gc-modal__slider-wrap">
      <GoalSlider
        v-if="captchaData"
        :ball-start-x="captchaData.ball_start_x"
        :track-width="captchaData.canvas?.width ?? 400"
        :success="state === 'success'"
        :disabled="state === 'verifying' || state === 'success'"
        @drag-start="onDragStart"
        @drag-move="handleDragMove"
        @drag-end="handleDragEnd"
      />
      <div v-else-if="state === 'loading'" class="gc-modal__slider-skeleton" />
      <div v-else-if="state === 'failed'" class="gc-modal__error-actions">
        <button type="button" class="gc-btn-primary" @click="retry">↺ Try again</button>
      </div>
    </div>

    <!-- One-time token injected into the parent form -->
    <input v-if="token" type="hidden" :name="fieldName" :value="token" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import GoalCanvas from './GoalCanvas.vue'
import GoalSlider from './GoalSlider.vue'
import { useGoalCaptcha } from '../composables/useGoalCaptcha.js'

// ─── Props ────────────────────────────────────────────────────────────────

const props = defineProps({
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

const emit = defineEmits(['verified', 'failed', 'loaded', 'close'])

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

function handleDragMove(x) {
  currentBallX.value = x
  onDragMove(x)
}

function handleDragEnd(x) {
  currentBallX.value = x
  onDragEnd(x)
}

// ─── Side-effects ──────────────────────────────────────────────────────────

watch(state, (s) => {
  if (s === 'success') {
    // Snap ball to exact target on success
    currentBallX.value = captchaData.value?.target_x ?? currentBallX.value
    emit('verified', token.value)
  }
  if (s === 'failed') {
    emit('failed', errorMsg.value)
    // Verify failure (captchaData exists) → auto-regenerate after a short pause
    if (captchaData.value) {
      setTimeout(() => {
        currentBallX.value = null
        retry()
      }, 1400)
    }
  }
  if (s === 'ready')   emit('loaded', captchaData.value)
})

onMounted(() => {
  if (props.autoLoad) load()
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
</style>
